import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — Get available slots for a given token
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Token mancante' }, { status: 400 });
        }

        // Fetch the interview record
        const { data: interview, error: intError } = await supabase
            .from('interviews')
            .select('*, candidates(*)')
            .eq('slot_token', token)
            .single();

        if (intError || !interview) {
            return NextResponse.json({ error: 'Invito non trovato o scaduto' }, { status: 404 });
        }

        if (interview.status === 'confirmed') {
            return NextResponse.json({
                already_booked: true,
                scheduled_at: interview.scheduled_at,
                candidate_name: interview.candidates?.first_name,
            });
        }

        // Fetch available admin slots
        const { data: slots } = await supabase
            .from('interview_slots')
            .select('*')
            .eq('is_active', true)
            .order('day_of_week', { ascending: true });

        // Generate available time slots for the next 7 days
        const availableSlots = generateAvailableSlots(slots || []);

        return NextResponse.json({
            candidate_name: interview.candidates?.first_name,
            slots: availableSlots,
            reference_timezone: 'Europe/Rome',
        });
    } catch (error) {
        console.error('Booking GET error:', error);
        return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
    }
}

// POST — Candidate confirms a slot
export async function POST(request: Request) {
    try {
        const { token, scheduled_at } = await request.json();

        if (!token || !scheduled_at) {
            return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 });
        }

        // Update the interview record
        const scheduledDate = new Date(scheduled_at);
        const endDate = new Date(scheduledDate.getTime() + 60 * 60 * 1000); // +1 hour

        const { data, error } = await supabase
            .from('interviews')
            .update({
                status: 'confirmed',
                scheduled_at,
                scheduled_start: scheduledDate.toISOString(),
                scheduled_end: endDate.toISOString(),
                channel: 'phone',
            })
            .eq('slot_token', token)
            .eq('status', 'pending')
            .select('*, candidates(*)')
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Errore nella conferma. Slot già prenotato?' }, { status: 400 });
        }

        // Update candidate status to 'interview_booked' now that they've actually booked
        if (data.candidate_id) {
            await supabase
                .from('candidates')
                .update({ status: 'interview_booked' })
                .eq('id', data.candidate_id);
        }

        // CAPI: invia evento Schedule (idempotente su fb_event_sent)
        const { data: interviewUpdated } = await supabase
            .from('interviews')
            .update({ fb_event_sent: true })
            .eq('id', data.id)
            .eq('fb_event_sent', false)
            .select('id')
            .single();

        if (interviewUpdated && data.candidate_id) {
            const fb_schedule_event_id = crypto.randomUUID();
            await supabase
                .from('candidates')
                .update({ fb_schedule_event_id, schedule_sent_at: new Date().toISOString() })
                .eq('id', data.candidate_id);

            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://closeragency.eu';
            const candidate = data.candidates as Record<string, string | null> | null;
            fetch(`${baseUrl}/api/fb-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                },
                body: JSON.stringify({
                    event_name: 'Schedule',
                    event_id: fb_schedule_event_id,
                    event_source_url: `${baseUrl}/booking`,
                    email: candidate?.email,
                    phone: candidate?.whatsapp,
                    firstName: candidate?.first_name,
                    lastName: candidate?.last_name,
                    fbp: candidate?.fbp,
                    fbc: candidate?.fbc,
                    ip_address: candidate?.ip_address,
                    user_agent: candidate?.user_agent,
                    country: candidate?.country ?? 'it',
                    external_id: data.candidate_id,
                }),
            }).catch((e) => console.error('[booking] fb-event error:', e));
        }

        // Send notification to admin
        try {
            const adminPhone = process.env.ADMIN_PHONE;
            const clicksendUser = process.env.CLICKSEND_USERNAME;
            const clicksendKey = process.env.CLICKSEND_API_KEY;
            const candidateName = `${data.candidates?.first_name} ${data.candidates?.last_name}`;
            const slotDate = new Date(scheduled_at).toLocaleString('it-IT', { timeZone: 'Europe/Rome', dateStyle: 'full', timeStyle: 'short' });

            // SMS to admin
            if (adminPhone && clicksendUser && clicksendKey) {
                await fetch('https://rest.clicksend.com/v3/sms/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Basic ' + Buffer.from(`${clicksendUser}:${clicksendKey}`).toString('base64'),
                    },
                    body: JSON.stringify({
                        messages: [{ source: 'nodejs', body: `${candidateName} ha confermato il colloquio per: ${slotDate}`, to: adminPhone }],
                    }),
                });
            }

            // Email to admin
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);
            const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@forever-slim.com';

            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: adminEmail,
                subject: `📅 Colloquio Confermato — ${candidateName}`,
                html: `
          <div style="font-family: sans-serif; padding: 24px;">
            <h2>Colloquio Confermato! 🎉</h2>
            <p><strong>${candidateName}</strong> ha scelto il seguente slot:</p>
            <p style="font-size: 18px; font-weight: bold; color: #4f46e5;">${slotDate}</p>
            <p>Email: ${data.candidates?.email}<br/>Tel: ${data.candidates?.whatsapp}</p>
          </div>
        `,
            });
        } catch (notifErr) {
            console.error('Admin notification error:', notifErr);
        }

        return NextResponse.json({ success: true, scheduled_at });
    } catch (error) {
        console.error('Booking POST error:', error);
        return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
    }
}

// Converte un'ora italiana (Europe/Rome) in UTC Date
function italianHourToUTC(baseDate: Date, italianHour: number): Date {
    // Ottieni anno/mese/giorno nel fuso italiano
    const year = parseInt(new Intl.DateTimeFormat('en', { timeZone: 'Europe/Rome', year: 'numeric' }).format(baseDate));
    const month = parseInt(new Intl.DateTimeFormat('en', { timeZone: 'Europe/Rome', month: 'numeric' }).format(baseDate)) - 1;
    const day = parseInt(new Intl.DateTimeFormat('en', { timeZone: 'Europe/Rome', day: 'numeric' }).format(baseDate));

    // Crea una data UTC di primo tentativo
    const utcGuess = new Date(Date.UTC(year, month, day, italianHour, 0, 0));

    // Controlla che ora è in Italia quando sono le italianHour UTC
    const italyHourStr = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Rome', hour: 'numeric', hour12: false }).format(utcGuess);
    const italyHour = parseInt(italyHourStr);

    // Aggiusta per l'offset (CET=+1, CEST=+2)
    const diff = italyHour - italianHour;
    return new Date(utcGuess.getTime() - diff * 60 * 60 * 1000);
}

function generateAvailableSlots(adminSlots: any[]) {
    const slots: { date: string; time: string; datetime: string; dayName: string; italianTime: string }[] = [];
    const now = new Date();

    for (let d = 1; d <= 7; d++) {
        const futureDate = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

        // Ottieni il giorno della settimana nel fuso italiano (non UTC del server)
        const italianDayStr = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Rome', weekday: 'short' }).format(futureDate);
        const dayMap: Record<string, number> = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
        const dayOfWeek = dayMap[italianDayStr];

        const matchingSlots = adminSlots.filter(s => s.day_of_week === dayOfWeek);

        for (const slot of matchingSlots) {
            const [startHour] = slot.start_time.split(':').map(Number);
            const [endHour] = slot.end_time.split(':').map(Number);

            for (let h = startHour; h < endHour; h++) {
                const utcDate = italianHourToUTC(futureDate, h);
                const italianTimeStr = `${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00`;

                slots.push({
                    date: utcDate.toLocaleDateString('it-IT', { timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long' }),
                    time: italianTimeStr,
                    datetime: utcDate.toISOString(),
                    dayName: utcDate.toLocaleDateString('it-IT', { timeZone: 'Europe/Rome', weekday: 'long' }),
                    italianTime: italianTimeStr,
                });
            }
        }
    }

    // Fallback: slot default Lun-Ven 10-18 se nessuno configurato
    if (slots.length === 0) {
        for (let d = 1; d <= 7; d++) {
            const futureDate = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
            const italianDayStr = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Rome', weekday: 'short' }).format(futureDate);
            const dayMap: Record<string, number> = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
            const dayOfWeek = dayMap[italianDayStr];
            if (dayOfWeek === 0 || dayOfWeek === 6) continue;

            for (let h = 10; h < 18; h++) {
                const utcDate = italianHourToUTC(futureDate, h);
                const italianTimeStr = `${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00`;

                slots.push({
                    date: utcDate.toLocaleDateString('it-IT', { timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long' }),
                    time: italianTimeStr,
                    datetime: utcDate.toISOString(),
                    dayName: utcDate.toLocaleDateString('it-IT', { timeZone: 'Europe/Rome', weekday: 'long' }),
                    italianTime: italianTimeStr,
                });
            }
        }
    }

    return slots;
}
