import { getResendApiKey } from '../lib/resendConfig.js';
import { getEmailSequence } from '../lib/emailSequence.js';

const FROM_EMAIL = 'Wolffia Diệp Châu <onboarding@resend.dev>';

const resolveRecipient = (email) => {
  const trimmed = String(email || '').trim();
  const match = trimmed.match(/^([^@+]+)\+test(@.+)$/i);
  if (match) {
    return {
      email: `${match[1]}${match[2]}`,
      testMode: true,
    };
  }

  return {
    email: trimmed,
    testMode: false,
  };
};

const sendEmail = async ({ apiKey, to, subject, html, text, scheduledAt }) => {
  const payload = {
    from: FROM_EMAIL,
    to: [to],
    subject,
    html,
    text,
  };

  if (scheduledAt) {
    payload.scheduled_at = scheduledAt;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || result?.error || 'Resend send failed');
  }

  return result;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ ok: false, message: 'Missing email' });
    }

    const apiKey = await getResendApiKey();
    if (!apiKey) {
      return res.status(500).json({ ok: false, message: 'Missing Resend API key' });
    }

    const sequence = await getEmailSequence(name || 'bạn');
    const recipient = resolveRecipient(email);
    const isTestMode = recipient.testMode;
    const now = new Date();

    const results = [];

    for (let index = 0; index < sequence.length; index += 1) {
      const emailItem = sequence[index];
      let scheduledAt = null;

      if (!isTestMode) {
        if (index === 1) {
          scheduledAt = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
        }
        if (index === 2) {
          scheduledAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
        }
      }

      const sendResult = await sendEmail({
        apiKey,
        to: recipient.email,
        subject: emailItem.subject,
        html: emailItem.html,
        text: emailItem.text,
        scheduledAt,
      });

      results.push({
        subject: emailItem.subject,
        id: sendResult.id,
        scheduledAt,
      });
    }

    return res.status(200).json({ ok: true, testMode: isTestMode, emails: results });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message || 'Unexpected server error' });
  }
}
