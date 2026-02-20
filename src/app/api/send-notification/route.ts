import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Visto che il dominio foreverslim.me non è abilitato per l'invio, usiamo il dominio sandbox/default di resend o un indirizzo onboarding-enabled.
// In assenza di dominio verificato Resend obbliga l'uso di onboarding@resend.dev verso l'indirizzo email verificato del proprietario (in questo caso te).
// Per ora configuriamo l'istanza.
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { first_name, last_name, email, whatsapp, score_total, priority, isKO } = body;

        const applicantName = `${first_name} ${last_name}`;

        // Per testare usiamo l'email di test generica di resend come mittente. 
        // In produzione andrà inserito un 'noreply@tuo-dominio.com' verificato.
        const senderEmail = 'onboarding@resend.dev';

        // Siccome siamo in sandbox Resend, l'email TARGET deve essere quella verificata sull'account Resend.
        // Usiamo una variabile d'ambiente o fallback a una email di default per inoltrare la notifica tecnica.
        const receiverEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@forever-slim.com';

        let subject = '';
        let htmlContent = '';

        if (isKO) {
            subject = `Nuova Candidatura (KO) - ${applicantName}`;
            htmlContent = `
        <h2>Candidatura Rifiutata Automaticamente</h2>
        <p>Il candidato <strong>${applicantName}</strong> (${email}) è stato scartato automaticamente dai filtri KO.</p>
      `;
        } else {
            subject = `[${priority.toUpperCase()}] Nuova Candidatura - ${applicantName} (Score: ${score_total})`;
            htmlContent = `
        <h2>Nuova Candidatura Ricevuta!</h2>
        <p><strong>Nome:</strong> ${applicantName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Punteggio Automazione:</strong> ${score_total}/100</p>
        <p><strong>Priorità:</strong> ${priority.toUpperCase()}</p>
        <br/>
        <p>Per vedere i dettagli completi, prova a consultare la <a href="https://tuo-link-vercel.vercel.app/admin">Dashboard Admin</a>.</p>
      `;
        }

        const data = await resend.emails.send({
            from: `Forever Slim Recruitment <${senderEmail}>`,
            to: [receiverEmail],
            subject: subject,
            html: htmlContent,
        });

        // ============================================
        // CLICKSEND SMS INTEGRATION
        // ============================================
        let clicksendResult = null;
        const clicksendUsername = process.env.CLICKSEND_USERNAME;
        const clicksendApiKey = process.env.CLICKSEND_API_KEY;
        const adminPhone = process.env.ADMIN_PHONE; // Il numero di telefono a cui mandare l'SMS (es: +393331234567)

        if (clicksendUsername && clicksendApiKey && adminPhone && !isKO) {
            const smsBody = `Nuova candid. (${priority}): ${applicantName}. Tel: ${whatsapp}. Score: ${score_total}`;

            try {
                const base64Auth = Buffer.from(`${clicksendUsername}:${clicksendApiKey}`).toString('base64');
                const smsResponse = await fetch('https://rest.clicksend.com/v3/sms/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${base64Auth}`
                    },
                    body: JSON.stringify({
                        messages: [
                            {
                                source: "nodejs",
                                body: smsBody,
                                to: adminPhone
                            }
                        ]
                    })
                });
                clicksendResult = await smsResponse.json();
            } catch (err) {
                console.error("Errore invio SMS ClickSend:", err);
            }
        }

        return NextResponse.json({ email: data, sms: clicksendResult });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
