import { getResendApiKey } from '../lib/resendConfig.js';

const FROM_EMAIL = 'onboarding@resend.dev';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      message: 'Resend test endpoint is ready',
      from: FROM_EMAIL,
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const apiKey = await getResendApiKey();
    if (!apiKey) {
      return res.status(500).json({ ok: false, message: 'Missing Resend API key' });
    }

    const { to } = req.body || {};
    if (!to || typeof to !== 'string') {
      return res.status(400).json({ ok: false, message: 'Missing recipient email' });
    }

    const upstream = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Wolffia Diệp Châu <${FROM_EMAIL}>`,
        to: [to],
        subject: 'Test kết nối Resend từ Wolffia',
        html: '<p>Kết nối Resend đã hoạt động. Đây là email test từ website Wolffia.</p>',
        text: 'Kết nối Resend đã hoạt động. Đây là email test từ website Wolffia.',
      }),
    });

    const payload = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        ok: false,
        message: payload?.message || payload?.error || 'Resend request failed',
        details: payload,
      });
    }

    return res.status(200).json({ ok: true, message: 'Test email sent', data: payload });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message || 'Unexpected server error' });
  }
}
