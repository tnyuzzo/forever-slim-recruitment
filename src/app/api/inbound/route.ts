import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Webhook } from 'svix';

const resend = new Resend(process.env.RESEND_API_KEY);

// Webhook Resend Inbound Email
// Riceve email in entrata su *@closeragency.eu e le inoltra a Gmail admin.

export async function POST(request: Request) {
    try {
        const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

        // Verifica firma Svix (sicurezza: solo Resend può chiamare questo endpoint)
        if (webhookSecret) {
            const svixId = request.headers.get('svix-id');
            const svixTimestamp = request.headers.get('svix-timestamp');
            const svixSignature = request.headers.get('svix-signature');

            if (!svixId || !svixTimestamp || !svixSignature) {
                return NextResponse.json({ error: 'Headers mancanti' }, { status: 400 });
            }

            const rawBody = await request.text();
            const wh = new Webhook(webhookSecret);

            try {
                wh.verify(rawBody, {
                    'svix-id': svixId,
                    'svix-timestamp': svixTimestamp,
                    'svix-signature': svixSignature,
                });
            } catch {
                return NextResponse.json({ error: 'Firma non valida' }, { status: 401 });
            }

            const payload = JSON.parse(rawBody);
            return await handleInbound(payload);
        }

        // Fallback senza verifica (solo in dev)
        const payload = await request.json();
        return await handleInbound(payload);

    } catch (error: any) {
        console.error('Inbound webhook error:', error);
        return NextResponse.json({ error: error?.message || 'Errore sconosciuto' }, { status: 500 });
    }
}

async function handleInbound(payload: any) {
    // Il payload Resend inbound è dentro payload.data per l'evento email.received
    const data = payload.data || payload;

    const from = data.from || 'mittente sconosciuto';
    const to = Array.isArray(data.to) ? data.to.join(', ') : (data.to || '');
    const subject = data.subject || '(nessun oggetto)';

    // Il webhook non include il body — va recuperato separatamente con l'API
    let bodyHtml = '';
    let bodyText = '';
    if (data.email_id) {
        try {
            const { data: emailContent } = await resend.emails.receiving.get(data.email_id);
            bodyHtml = emailContent?.html || '';
            bodyText = emailContent?.text || '';
        } catch (err) {
            console.error('Errore fetch email content:', err);
        }
    }

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@forever-slim.com';
    const senderEmail = 'notifiche@closeragency.eu';

    const forwardedHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 680px; margin: 0 auto; padding: 24px;">
        <div style="background: #f1f5f9; border-left: 4px solid #4f46e5; padding: 12px 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Email inoltrata da closeragency.eu</p>
          <p style="margin: 4px 0 0; font-size: 13px; color: #334155;"><strong>Da:</strong> ${from}</p>
          <p style="margin: 4px 0 0; font-size: 13px; color: #334155;"><strong>A:</strong> ${to}</p>
          <p style="margin: 4px 0 0; font-size: 13px; color: #334155;"><strong>Oggetto:</strong> ${subject}</p>
        </div>
        ${bodyHtml
            ? bodyHtml
            : bodyText
                ? `<p style="color: #475569; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${bodyText}</p>`
                : `<details><summary style="cursor:pointer;color:#6366f1;font-size:12px;">Debug payload (body non trovato)</summary><pre style="font-size:11px;overflow:auto;">${JSON.stringify(data, null, 2)}</pre></details>`
        }
      </div>
    `;

    await resend.emails.send({
        from: `Closer Agency Inbound <${senderEmail}>`,
        to: [adminEmail],
        subject: `[FWD] ${subject}`,
        html: forwardedHtml,
        replyTo: from,
    });

    return NextResponse.json({ success: true });
}
