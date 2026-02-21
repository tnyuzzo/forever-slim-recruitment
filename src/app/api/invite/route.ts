import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper: fetch con timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        return res;
    } finally {
        clearTimeout(timer);
    }
}

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
        }

        // 4. Build booking link
        // Usa sempre l'URL stabile (alias Vercel o dominio custom), MAI il VERCEL_URL che è deployment-specific
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://recruitment-app-sage.vercel.app';
        const bookingLink = `${baseUrl}/book/${token}`;

        const results: { email?: { success: boolean; detail?: string }; sms?: { success: boolean; detail?: string } } = {};

        // 5. Send Email + SMS in parallelo (non sequenziale)
        const promises: Promise<void>[] = [];

        if (channels.includes('email') && candidate.email) {
            promises.push((async () => {
                try {
                    const emailResult = await resend.emails.send({
                        from: 'onboarding@resend.dev',
                        to: candidate.email,
                        subject: `Fissa il tuo Colloquio Conoscitivo, ${candidate.first_name}!`,
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
                  Scegli il tuo Slot
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 13px; text-align: center;">
                Se il pulsante non funziona, copia questo link nel browser:<br/>
                <a href="${bookingLink}" style="color: #6366f1;">${bookingLink}</a>
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                Recruiting Team
              </p>
            </div>
          `,
                    });
                    console.log('Email result:', JSON.stringify(emailResult));
                    results.email = { success: true, detail: 'Email inviata' };
                } catch (emailErr: any) {
                    console.error('Email error:', emailErr?.message || emailErr);
                    const msg = emailErr?.message || String(emailErr);
                    if (msg.includes('verify') || msg.includes('domain') || msg.includes('sandbox')) {
                        results.email = { success: false, detail: 'Resend in modalità sandbox: per inviare a candidati serve un dominio verificato. Email inviata solo alla mail admin.' };
                    } else {
                        results.email = { success: false, detail: 'Errore invio email: ' + msg };
                    }
                }
            })());
        }

        if (channels.includes('sms') && candidate.whatsapp) {
            promises.push((async () => {
                try {
                    const clicksendUser = process.env.CLICKSEND_USERNAME;
                    const clicksendKey = process.env.CLICKSEND_API_KEY;

                    if (!clicksendUser || !clicksendKey) {
                        results.sms = { success: false, detail: 'Credenziali ClickSend non configurate' };
                        return;
                    }

                    const smsBody = {
                        messages: [
                            {
                                source: 'nodejs',
                                body: `Ciao ${candidate.first_name}, complimenti! Sei stato selezionato per un colloquio conoscitivo. Scegli il tuo slot qui: ${bookingLink}`,
                                to: candidate.whatsapp,
                            },
                        ],
                    };

                    const smsRes = await fetchWithTimeout('https://rest.clicksend.com/v3/sms/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Basic ' + Buffer.from(`${clicksendUser}:${clicksendKey}`).toString('base64'),
                        },
                        body: JSON.stringify(smsBody),
                    }, 10000);

                    const smsData = await smsRes.json();
                    console.log('SMS result:', JSON.stringify(smsData));

                    if (smsData?.http_code === 200 || smsData?.response_code === 'SUCCESS') {
                        results.sms = { success: true, detail: 'SMS inviato' };
                    } else {
                        results.sms = { success: false, detail: 'ClickSend risposta: ' + (smsData?.response_msg || JSON.stringify(smsData)) };
                    }
                } catch (smsErr: any) {
                    console.error('SMS error:', smsErr?.message || smsErr);
                    if (smsErr?.name === 'AbortError') {
                        results.sms = { success: false, detail: 'Timeout invio SMS (>10s). L\'SMS potrebbe arrivare comunque.' };
                    } else {
                        results.sms = { success: false, detail: 'Errore invio SMS: ' + (smsErr?.message || String(smsErr)) };
                    }
                }
            })());
        }

        // Attendi tutti i canali in parallelo
        await Promise.all(promises);

        // 7. Update candidate status to 'invited'
        await supabase
            .from('candidates')
            .update({ status: 'invited', interview_link: bookingLink })
            .eq('id', candidate_id);

        return NextResponse.json({ success: true, bookingLink, results });
    } catch (error: any) {
        console.error('Invite route error:', error);
        return NextResponse.json({ error: 'Errore interno: ' + (error?.message || 'Sconosciuto') }, { status: 500 });
    }
}
