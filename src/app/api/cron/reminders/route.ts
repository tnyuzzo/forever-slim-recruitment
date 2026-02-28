import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/escapeHtml';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

const CRON_SECRET = process.env.CRON_SECRET;

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

// Ora italiana corrente
function getItalianHour(date: Date): number {
    return parseInt(new Intl.DateTimeFormat('en', { timeZone: 'Europe/Rome', hour: 'numeric', hour12: false }).format(date));
}

// Data italiana (YYYY-MM-DD) per confronto giorno
function getItalianDateStr(date: Date): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(date);
}

// Messaggi personalizzati per ogni reminder
const REMINDER_CONFIG = [
    {
        // Reminder 1: 1h dopo invito
        emailSubject: (name: string) => `Prenota il tuo colloquio, ${name}!`,
        emailHeading: (name: string) => `Ciao ${name}, il tuo slot ti aspetta!`,
        emailBody: `Ti abbiamo selezionato per un colloquio conoscitivo. Ci vogliono meno di 30 secondi per scegliere il tuo orario preferito.`,
        smsBody: (name: string, link: string) => `Ciao ${name}, ricordati di prenotare il tuo colloquio conoscitivo! Scegli il tuo slot: ${link}`,
    },
    {
        // Reminder 2: 3h dopo invito
        emailSubject: (name: string) => `Non dimenticare il colloquio, ${name}!`,
        emailHeading: (name: string) => `${name}, non dimenticare di prenotare!`,
        emailBody: `Gli slot disponibili per il colloquio conoscitivo si stanno riempiendo. Prenota il tuo in pochi secondi prima che si esauriscano.`,
        smsBody: (name: string, link: string) => `${name}, gli slot per il colloquio si stanno riempiendo! Prenota ora: ${link}`,
    },
    {
        // Reminder 3: mattina seguente ore 9
        emailSubject: (name: string) => `Buongiorno ${name} — il tuo colloquio ti aspetta`,
        emailHeading: () => `Buongiorno! Non perdere questa opportunita`,
        emailBody: `Ieri ti abbiamo inviato l'invito per fissare il tuo colloquio conoscitivo. Restano pochi slot disponibili — scegli il tuo prima che finiscano.`,
        smsBody: (name: string, link: string) => `Buongiorno ${name}! Restano pochi slot per il colloquio. Prenota il tuo: ${link}`,
    },
    {
        // Reminder 4: sera seguente ore 21 (ultimo)
        emailSubject: (name: string) => `Ultimo avviso: prenota il colloquio, ${name}`,
        emailHeading: () => `Ultima opportunita per prenotare`,
        emailBody: `Questo e il nostro ultimo promemoria. Se sei ancora interessato alla posizione, prenota il tuo slot per il colloquio conoscitivo. Dopo oggi, il tuo posto potrebbe essere assegnato ad un altro candidato.`,
        smsBody: (name: string, link: string) => `${name}, ultimo avviso! Prenota il colloquio entro stasera o il posto potrebbe essere assegnato ad altri: ${link}`,
    },
];

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    try {
        const now = new Date();
        const italianHour = getItalianHour(now);
        const todayItalian = getItalianDateStr(now);

        // Trova candidati invitati con interview pending (non ancora prenotata)
        const { data: pendingInterviews, error } = await supabase
            .from('interviews')
            .select('id, candidate_id, slot_token, created_at, candidates(id, first_name, last_name, email, whatsapp, status, reminder_count, last_reminder_at, interview_link)')
            .eq('status', 'pending')
            .not('slot_token', 'is', null);

        if (error) {
            console.error('Error fetching pending interviews:', error);
            return NextResponse.json({ error: 'Errore DB' }, { status: 500 });
        }

        if (!pendingInterviews || pendingInterviews.length === 0) {
            return NextResponse.json({ message: 'Nessun reminder da inviare', sent: 0 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://recruitment-app-sage.vercel.app';
        let sentCount = 0;
        const results: { candidate: string; reminder: number; channels: string[] }[] = [];

        for (const interview of pendingInterviews) {
            const candidate = interview.candidates as any;
            if (!candidate || candidate.status !== 'invited') continue;

            const interviewCreatedAt = new Date(interview.created_at);
            const reminderCount = candidate.reminder_count || 0;
            const hoursSinceInvite = (now.getTime() - interviewCreatedAt.getTime()) / (1000 * 60 * 60);
            const inviteDateItalian = getItalianDateStr(interviewCreatedAt);
            const isNextDay = todayItalian > inviteDateItalian;

            // Max 4 reminder poi stop
            if (reminderCount >= 4) continue;

            let shouldSend = false;

            if (reminderCount === 0 && hoursSinceInvite >= 1) {
                // Reminder 1: 1h dopo invito
                shouldSend = true;
            } else if (reminderCount === 1 && hoursSinceInvite >= 3) {
                // Reminder 2: 3h dopo invito
                shouldSend = true;
            } else if (reminderCount === 2 && isNextDay && italianHour >= 9) {
                // Reminder 3: mattina seguente, dalle 9 in poi
                shouldSend = true;
            } else if (reminderCount === 3 && isNextDay && italianHour >= 21) {
                // Reminder 4: sera seguente, dalle 21 in poi
                shouldSend = true;
            }

            if (!shouldSend) continue;

            const config = REMINDER_CONFIG[reminderCount];
            const bookingLink = candidate.interview_link || `${baseUrl}/book/${interview.slot_token}`;
            const firstName = candidate.first_name;
            const safeFirstName = escapeHtml(firstName);
            const channelsSent: string[] = [];

            // Invio Email
            if (candidate.email) {
                try {
                    await resend.emails.send({
                        from: 'Closer Agency <recruiting@closeragency.eu>',
                        to: candidate.email,
                        subject: config.emailSubject(firstName),
                        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 24px; font-weight: 800; color: #1e293b; margin: 0;">
                  ${escapeHtml(config.emailHeading(firstName))}
                </h1>
              </div>
              <p style="color: #475569; font-size: 15px; line-height: 1.7;">
                ${config.emailBody}
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${bookingLink}" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; text-decoration: none;">
                  Scegli il tuo Slot
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 13px; text-align: center;">
                Se il pulsante non funziona, copia questo link:<br/>
                <a href="${bookingLink}" style="color: #6366f1;">${bookingLink}</a>
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                Recruiting Team
              </p>
            </div>
          `,
                    });
                    channelsSent.push('email');
                } catch (emailErr) {
                    console.error(`Email reminder ${reminderCount + 1} error for ${firstName}:`, emailErr);
                }
            }

            // Invio SMS
            if (candidate.whatsapp) {
                try {
                    const clicksendUser = process.env.CLICKSEND_USERNAME;
                    const clicksendKey = process.env.CLICKSEND_API_KEY;

                    if (clicksendUser && clicksendKey) {
                        await fetchWithTimeout('https://rest.clicksend.com/v3/sms/send', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Basic ' + Buffer.from(`${clicksendUser}:${clicksendKey}`).toString('base64'),
                            },
                            body: JSON.stringify({
                                messages: [{ source: 'nodejs', body: config.smsBody(firstName, bookingLink), to: candidate.whatsapp }],
                            }),
                        }, 10000);
                        channelsSent.push('sms');
                    }
                } catch (smsErr) {
                    console.error(`SMS reminder ${reminderCount + 1} error for ${firstName}:`, smsErr);
                }
            }

            // Aggiorna contatore
            await supabase
                .from('candidates')
                .update({
                    reminder_count: reminderCount + 1,
                    last_reminder_at: now.toISOString(),
                })
                .eq('id', candidate.id);

            sentCount++;
            results.push({
                candidate: `${firstName} ${candidate.last_name}`,
                reminder: reminderCount + 1,
                channels: channelsSent,
            });
        }

        return NextResponse.json({
            message: `Reminder inviati a ${sentCount} candidati`,
            sent: sentCount,
            italianHour,
            results,
        });
    } catch (error: any) {
        console.error('Cron reminders error:', error);
        return NextResponse.json({ error: 'Errore interno: ' + (error?.message || 'Sconosciuto') }, { status: 500 });
    }
}
