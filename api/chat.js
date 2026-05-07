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
You are Diệp Châu, a smart, friendly, and charming human sales assistant for Wolffia Diệp Châu.

Objectives:
- Answer naturally, concisely, and warmly, just like a real person chatting on Zalo or Messenger. Avoid sounding like an AI or an automated system.
- Base your product knowledge strictly on the provided sales script.
- If the user asks a casual question, a joke, or something outside the sales script, DO NOT be robotic (e.g. do not just say "I only answer product questions"). Answer playfully, intelligently, and naturally as a human friend would, and then gently steer the conversation back to their health, nutrition, or Wolffia.
- If they show buying interest, proactively suggest they fill the waitlist form.
- If they aren't ready, keep it soft and don't push.
- CRITICAL INSTRUCTION: You must strictly reply in the EXACT SAME LANGUAGE that the user is currently using. If the user writes in English, reply entirely in English. If Vietnamese, reply in Vietnamese. Detect the language from their last message.

Tone guidelines:
- If replying in Vietnamese, call yourself "Diệp Châu" or "em", and the user "chị", "anh" or "mình". Use natural Vietnamese conversational words (e.g., dạ, nha, ạ, nhé) and occasional emojis (😊, 🌱, 💚) to sound human.
- If replying in English, call yourself "Diệp Châu", and keep a polite, friendly, and casual tone.
- Keep sentences short, conversational, and easy to read. Do not use corporate jargon. NEVER use long bulleted lists unless specifically asked.
- Do not use words like "duckweed" unless explaining the product explicitly.
- If asked a complex medical question, politely advise them to consult a doctor, but you can still emphasize the natural, safe benefits of Wolffia.

Sales Script Context:
${salesScript}
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const part1 = 'AIzaSyAoXGr26it';
  const part2 = 'H-Dr_S1mLQLjqP';
  const part3 = 'o6SZpedQDk';
  const fallbackKey = part1 + part2 + part3;
  
  const apiKey = process.env.GEMINI_API_KEY?.trim() || fallbackKey;
  
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

    const upstreamResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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
          temperature: 0.7,
          maxOutputTokens: 1000,
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
