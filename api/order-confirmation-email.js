import { getResendApiKey } from '../lib/resendConfig.js';

const FROM_EMAIL = 'Wolffia Diệp Châu <onboarding@resend.dev>';

const buildOrderConfirmation = ({ name, productName, amount, address }) => {
  const displayName = name || 'bạn';
  const displayAmount = `${Number(amount || 0).toLocaleString('vi-VN')}đ`;

  const subject = `Cherry đã nhận đơn ${productName || 'Wolffia'} của bạn rồi nè`;
  const text = `Chào ${displayName},

Cherry xác nhận đã nhận đơn hàng của bạn rồi nha.

Sản phẩm: ${productName || 'Wolffia'}
Số tiền: ${displayAmount}

Nếu mọi thứ đã đúng, bên Cherry sẽ chuẩn bị hàng và sắp xếp giao theo thông tin bạn để lại${address ? ` tại ${address}` : ''}.

Thật ra đơn giản thôi, bạn chỉ cần để ý điện thoại giúp Cherry. Khi hàng sẵn sàng bên mình sẽ nhắn hoặc gọi để chốt lại thời gian nhận cho tiện nhất.

Cảm ơn bạn đã tin Diệp Châu nha.

Cherry mời bạn ❤️`;

  const html = `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#243424">
    <p>Chào ${displayName},</p>
    <p>Cherry xác nhận đã nhận đơn hàng của bạn rồi nha.</p>
    <p><strong>Sản phẩm:</strong> ${productName || 'Wolffia'}<br />
    <strong>Số tiền:</strong> ${displayAmount}</p>
    <p>Nếu mọi thứ đã đúng, bên Cherry sẽ chuẩn bị hàng và sắp xếp giao theo thông tin bạn để lại${address ? ` tại ${address}` : ''}.</p>
    <p>Thật ra đơn giản thôi, bạn chỉ cần để ý điện thoại giúp Cherry. Khi hàng sẵn sàng bên mình sẽ nhắn hoặc gọi để chốt lại thời gian nhận cho tiện nhất.</p>
    <p>Cảm ơn bạn đã tin Diệp Châu nha.</p>
    <p>Cherry mời bạn ❤️</p>
  </div>`;

  return { subject, text, html };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const { email, name, productName, amount, address } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ ok: false, message: 'Missing customer email' });
    }

    const apiKey = await getResendApiKey();
    if (!apiKey) {
      return res.status(500).json({ ok: false, message: 'Missing Resend API key' });
    }

    const emailContent = buildOrderConfirmation({ name, productName, amount, address });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, message: payload?.message || payload?.error || 'Resend send failed' });
    }

    return res.status(200).json({ ok: true, data: payload });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message || 'Unexpected server error' });
  }
}
