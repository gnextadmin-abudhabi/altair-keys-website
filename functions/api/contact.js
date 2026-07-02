/**
 * Cloudflare Pages Function — Contact Form Handler
 * POST /api/contact → sends email via Resend.com
 * 
 * Set in Cloudflare Dashboard → Workers & Pages → Settings → Variables:
 *   RESEND_API_KEY = re_xxxxxxxxxxxx
 *   CONTACT_TO_EMAIL = info@altairkeys.com
 */

export async function onRequestPost({ request, env }) {
    try {
        const fd = await request.formData();
        const name = fd.get('name') || 'N/A';
        const phone = fd.get('phone') || 'N/A';
        const email = fd.get('email') || 'N/A';
        const svc = fd.get('service') || 'N/A';
        const loc = fd.get('location') || 'N/A';
        const msg = fd.get('message') || 'No message';
        const urgent = fd.get('urgent') ? '🚨 URGENT — ' : '';

        const html = `<!DOCTYPE html>
<html><body style="font-family:Arial;max-width:600px;padding:20px;">
<h2 style="color:#C8962E;">${urgent}New Enquiry — Al Tair Althahbi</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:100px;">Name</td><td style="padding:8px;">${name}</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;"><a href="tel:${phone}">${phone}</a></td></tr>
<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Service</td><td style="padding:8px;">${svc}</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Location</td><td style="padding:8px;">${loc}</td></tr>
</table>
<h3>Message:</h3>
<p style="background:#f8f8f8;padding:12px;border-radius:6px;">${msg}</p>
<p style="color:#999;font-size:12px;">Sent from altairkeys.com</p>
</body></html>`;

        const to = env.CONTACT_TO_EMAIL || 'info@altairkeys.com';
        
        const r = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Al Tair Website <onboarding@resend.dev>',
                to,
                subject: `${urgent}Enquiry from ${name} — Al Tair Althahbi`,
                html,
                reply_to: email !== 'N/A' ? email : undefined,
            }),
        });

        if (!r.ok) throw new Error(await r.text());

        return Response.redirect('/contact.html?sent=ok', 302);
    } catch (e) {
        console.error(e);
        return Response.redirect('/contact.html?sent=err', 302);
    }
}
