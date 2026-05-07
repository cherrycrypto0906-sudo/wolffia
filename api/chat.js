import { SALES_SCRIPT } from './salesScript.js';

const normalizeMessages = (messages = []) =>
  messages
    .filter((message) => message && (message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string')
    .slice(-12)
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content.trim() }],
    }))
    .filter((message) => message.parts[0].text);

const buildSystemPrompt = (salesScript) => `
You are Diệp Châu, a sales chatbot for Wolffia Diệp Châu.

Objectives:
- Answer naturally, concisely, warmly, like a real seller.
- Strictly base your answers on the provided sales script. Do not invent information.
- If the user shows buying interest, proactively suggest they fill the waitlist form.
- If they aren't ready, keep it soft and don't push.
- CRITICAL INSTRUCTION: You must strictly reply in the EXACT SAME LANGUAGE that the user is currently using. If the user writes in English, reply entirely in English. If Vietnamese, reply in Vietnamese. Detect the language from their last message.

Tone guidelines:
- If replying in Vietnamese, call yourself "Diệp Châu" or "em", and the user "chị" or "mình".
- If replying in English, call yourself "Diệp Châu", and keep a polite, friendly tone.
- Keep sentences short, easy to read, not corporate or boastful.
- Do not use words like "duckweed" unless explaining the product explicitly.
- If unsure, honestly say you don't want to over-promise and invite them to leave info for human consultation.

Sales Script Context:
${salesScript}
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim() || 'AIzaSyDZ0-Ha8v1dkur8CKF4nfpG7GDiJjhSjdQ';
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
  }

  try {
    const { messages } = req.body || {};
    const conversation = normalizeMessages(messages);

    if (conversation.length === 0) {
      return res.status(400).json({ error: 'Missing conversation messages' });
    }

    const systemPrompt = buildSystemPrompt(SALES_SCRIPT);

    const upstreamResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: conversation,
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 300,
        }
      }),
    });

    const payload = await upstreamResponse.json();

    if (!upstreamResponse.ok) {
      return res.status(upstreamResponse.status).json({
        error: payload?.error?.message || 'Gemini API request failed',
      });
    }

    const content = payload?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!content) {
      return res.status(502).json({ error: 'Empty model response' });
    }

    return res.status(200).json({ message: content });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unexpected server error' });
  }
}
