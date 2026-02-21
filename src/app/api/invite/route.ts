import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { candidate_id, channels } = await request.json();

        // 1. Fetch candidate
        const { data: candidate, error: candidateError } = await supabase
            .from('candidates')
            .select('*')
            .eq('id', candidate_id)
            .single();

        if (candidateError || !candidate) {
            return NextResponse.json({ error: 'Candidato non trovato' }, { status: 404 });
        }

        // 2. Generate unique token
        const token = crypto.randomUUID();

        // 3. Create interview record
        const { error: insertError } = await supabase
            .from('interviews')
            .insert({
                candidate_id,
                slot_token: token,
                status: 'pending',
            });

        if (insertError) {
            console.error('Error creating interview:', insertError);
            // If the interviews table doesn't exist yet, we still send the invite with a generic booking link
        }

        // 4. Build booking link
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_SITE_URL || 'https://recruitment-app-sage.vercel.app';
        const bookingLink = `${baseUrl}/book/${token}`;

        const applicantName = `${candidate.first_name} ${candidate.last_name}`;
        const results: { email?: any; sms?: any } = {};

        // 5. Send Email
        if (channels.includes('email') && candidate.email) {
            try {
                const emailResult = await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: candidate.email,
                    subject: `Forever Slim — Fissa il tuo Colloquio, ${candidate.first_name}!`,
                    html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 24px; font-weight: 800; color: #1e293b; margin: 0;">Complimenti, ${candidate.first_name}! 🎉</h1>
              </div>
              <p style="color: #475569; font-size: 15px; line-height: 1.7;">
                Il tuo profilo ci ha colpito e vorremmo conoscerti meglio con un breve colloquio conoscitivo.
              </p>
              <p style="color: #475569; font-size: 15px; line-height: 1.7;">
                Clicca il pulsante qui sotto per scegliere la fascia oraria che preferisci:
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${bookingLink}" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; text-decoration: none;">
                  📅 Scegli il tuo Slot
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 13px; text-align: center;">
                Se il pulsante non funziona, copia questo link nel browser:<br/>
                <a href="${bookingLink}" style="color: #6366f1;">${bookingLink}</a>
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                Forever Slim Recruiting Team
              </p>
            </div>
          `,
                });
                results.email = emailResult;
            } catch (emailErr) {
                console.error('Email error:', emailErr);
                results.email = { error: 'Errore invio email' };
            }
        }

        // 6. Send SMS via ClickSend
        if (channels.includes('sms') && candidate.whatsapp) {
            try {
                const clicksendUser = process.env.CLICKSEND_USERNAME;
                const clicksendKey = process.env.CLICKSEND_API_KEY;

                if (clicksendUser && clicksendKey) {
                    const smsBody = {
                        messages: [
                            {
                                body: `Ciao ${candidate.first_name}, complimenti! 🎉 Sei stato selezionato per un colloquio con Forever Slim. Scegli il tuo slot qui: ${bookingLink}`,
                                to: candidate.whatsapp,
                                from: 'ForeverSlim',
                            },
                        ],
                    };

                    const smsRes = await fetch('https://rest.clicksend.com/v3/sms/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Basic ' + Buffer.from(`${clicksendUser}:${clicksendKey}`).toString('base64'),
                        },
                        body: JSON.stringify(smsBody),
                    });

                    results.sms = await smsRes.json();
                }
            } catch (smsErr) {
                console.error('SMS error:', smsErr);
                results.sms = { error: 'Errore invio SMS' };
            }
        }

        // 7. Update candidate status to 'invited' (not 'interview_booked' — that happens when they actually book)
        await supabase
            .from('candidates')
            .update({ status: 'invited', interview_link: bookingLink })
            .eq('id', candidate_id);

        return NextResponse.json({ success: true, bookingLink, results });
    } catch (error) {
        console.error('Invite route error:', error);
        return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
    }
}
