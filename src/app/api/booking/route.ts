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

        // Send notification to admin
        try {
            const adminPhone = process.env.ADMIN_PHONE;
            const clicksendUser = process.env.CLICKSEND_USERNAME;
            const clicksendKey = process.env.CLICKSEND_API_KEY;
            const candidateName = `${data.candidates?.first_name} ${data.candidates?.last_name}`;
            const slotDate = new Date(scheduled_at).toLocaleString('it-IT', { dateStyle: 'full', timeStyle: 'short' });

            // SMS to admin
            if (adminPhone && clicksendUser && clicksendKey) {
                await fetch('https://rest.clicksend.com/v3/sms/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Basic ' + Buffer.from(`${clicksendUser}:${clicksendKey}`).toString('base64'),
                    },
                    body: JSON.stringify({
                        messages: [{ body: `📅 ${candidateName} ha confermato il colloquio per: ${slotDate}`, to: adminPhone, from: 'ForeverSlim' }],
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

function generateAvailableSlots(adminSlots: any[]) {
    const slots: { date: string; time: string; datetime: string; dayName: string }[] = [];
    const now = new Date();

    for (let d = 1; d <= 7; d++) {
        const date = new Date(now);
        date.setDate(now.getDate() + d);
        const dayOfWeek = date.getDay(); // 0 = Sunday

        const matchingSlots = adminSlots.filter(s => s.day_of_week === dayOfWeek);

        for (const slot of matchingSlots) {
            const [startHour] = slot.start_time.split(':').map(Number);
            const [endHour] = slot.end_time.split(':').map(Number);

            // Generate hourly slots
            for (let h = startHour; h < endHour; h++) {
                const slotDate = new Date(date);
                slotDate.setHours(h, 0, 0, 0);

                slots.push({
                    date: slotDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }),
                    time: `${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00`,
                    datetime: slotDate.toISOString(),
                    dayName: slotDate.toLocaleDateString('it-IT', { weekday: 'long' }),
                });
            }
        }
    }

    // If no admin slots configured, generate default slots (Mon-Fri 10-18)
    if (slots.length === 0) {
        for (let d = 1; d <= 7; d++) {
            const date = new Date(now);
            date.setDate(now.getDate() + d);
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

            for (let h = 10; h < 18; h++) {
                const slotDate = new Date(date);
                slotDate.setHours(h, 0, 0, 0);
                slots.push({
                    date: slotDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }),
                    time: `${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00`,
                    datetime: slotDate.toISOString(),
                    dayName: slotDate.toLocaleDateString('it-IT', { weekday: 'long' }),
                });
            }
        }
    }

    return slots;
}
