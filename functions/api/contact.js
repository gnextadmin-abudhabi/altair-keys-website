/**
 * Cloudflare Pages Function — Contact Form → Resend
 * POST /api/contact
 *
 * Set in Cloudflare Dashboard → Workers & Pages → altair-keys → Settings → Variables:
 *   RESEND_API_KEY  = re_xxxxxxxxxxxx   (from resend.com)
 *   CONTACT_TO      = info@altairkeys.com
 */

export async function onRequestPost({ request, env }) {
    try {
        const fd = await request.formData();

        // Honeypot check — bots fill this hidden field
        if (fd.get('_honey')) {
            return Response.json({ ok: true }); // silent discard
        }

        const name    = (fd.get('name')     || '').trim().slice(0, 200);
        const phone   = (fd.get('phone')    || '').trim().slice(0, 30);
        const email   = (fd.get('email')    || '').trim().slice(0, 200);
        const service = (fd.get('service')  || '').trim().slice(0, 100);
        const location= (fd.get('location') || '').trim().slice(0, 100);
        const message = (fd.get('message')  || '').trim().slice(0, 2000);

        if (!name || !phone || !message) {
            return Response.json({ ok: false, error: 'Required fields missing' }, { status: 400 });
        }

        const urgent  = service === 'emergency-locksmith' ? '🚨 URGENT — ' : '';
        const to      = env.CONTACT_TO   || 'info@altairkeys.com';
        const from    = env.CONTACT_FROM || 'onboarding@resend.dev';

        const html = `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:24px;">
<div style="background:#1a1a2e;padding:20px 24px;border-radius:8px 8px 0 0;">
  <h2 style="color:#c9a84c;margin:0;">${urgent}New Enquiry — Al Tair Althahbi Key Cutting</h2>
</div>
<div style="border:1px solid #e0e0e0;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
  <table style="width:100%;border-collapse:collapse;font-size:15px;">
    <tr><td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;color:#666;width:120px;">Name</td><td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-weight:600;">${escHtml(name)}</td></tr>
    <tr><td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;color:#666;">Phone</td><td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;"><a href="tel:${escHtml(phone)}" style="color:#c9a84c;">${escHtml(phone)}</a></td></tr>
    <tr><td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;color:#666;">Email</td><td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;">${email ? `<a href="mailto:${escHtml(email)}" style="color:#c9a84c;">${escHtml(email)}</a>` : '—'}</td></tr>
    <tr><td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;color:#666;">Service</td><td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;">${escHtml(service) || '—'}</td></tr>
    <tr><td style="padding:10px 8px;color:#666;">Location</td><td style="padding:10px 8px;">${escHtml(location) || '—'}</td></tr>
  </table>
  <h3 style="margin:20px 0 8px;color:#1a1a2e;">Message:</h3>
  <div style="background:#f8f6f0;padding:16px;border-radius:6px;border-left:4px solid #c9a84c;line-height:1.6;">${escHtml(message)}</div>
  <p style="margin-top:24px;color:#999;font-size:12px;">Sent from altairkeys.com contact form</p>
</div>
</body></html>`;

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: `Al Tair Website <${from}>`,
                to: [to],
                subject: `${urgent}Enquiry from ${name} — Al Tair`,
                html,
                reply_to: email || undefined,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('Resend error:', err);
            return Response.json({ ok: false, error: 'Email send failed' }, { status: 500 });
        }

        return Response.json({ ok: true });

    } catch (e) {
        console.error('Contact handler error:', e);
        return Response.json({ ok: false, error: 'Server error' }, { status: 500 });
    }
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
