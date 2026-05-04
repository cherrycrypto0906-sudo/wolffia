import { readFile } from 'node:fs/promises';

const SALES_SCRIPT_PATH = new URL('../sales_script.md', import.meta.url);

const normalizeMessages = (messages = []) =>
  messages
    .filter((message) => message && (message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string')
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }))
    .filter((message) => message.content);

const buildSystemPrompt = (salesScript) => `
Bạn là Diệp Châu, chatbot bán hàng cho Wolffia Diệp Châu.

Mục tiêu:
- Trả lời tự nhiên, ngắn gọn, gần gũi, đúng giọng người bán thật.
- Dựa trên kịch bản và dữ liệu có sẵn, không bịa thông tin ngoài đó.
- Khi khách có vẻ quan tâm mua, chủ động gợi họ điền form danh sách chờ.
- Khi khách chưa sẵn sàng mua, giữ giọng mềm, không ép.
- QUAN TRỌNG: Khách hỏi bằng ngôn ngữ nào, hãy trả lời bằng ngôn ngữ đó.

Quy tắc giọng điệu:
- Viết tự nhiên theo ngôn ngữ của khách.
- Xưng là Diệp Châu. Nếu dùng tiếng Việt, xưng là Diệp Châu hoặc em, gọi khách là chị hoặc mình tùy ngữ cảnh.
- Câu ngắn, dễ hiểu, không corporate, không khoa trương.
- Không dùng các từ liên tưởng tới "bèo" để gọi sản phẩm, trừ khi khách hỏi trực tiếp và cần giải thích.
- Nếu chưa chắc câu trả lời, nói thẳng là Diệp Châu chưa dám nói quá và mời khách để lại form để được tư vấn kỹ hơn.

Kịch bản nguồn:
${salesScript}
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const model = process.env.OPENROUTER_MODEL?.trim() || 'openai/gpt-4o-mini';
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY' });
  }

  try {
    const { messages } = req.body || {};
    const conversation = normalizeMessages(messages);

    if (conversation.length === 0) {
      return res.status(400).json({ error: 'Missing conversation messages' });
    }

    const salesScript = await readFile(SALES_SCRIPT_PATH, 'utf8');
    const systemPrompt = buildSystemPrompt(salesScript);

    const upstreamResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.origin || 'https://localhost',
        'X-Title': 'Wolffia Chatbot',
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 300,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversation,
        ],
      }),
    });

    const payload = await upstreamResponse.json();

    if (!upstreamResponse.ok) {
      return res.status(upstreamResponse.status).json({
        error: payload?.error?.message || 'OpenRouter request failed',
      });
    }

    const content = payload?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return res.status(502).json({ error: 'Empty model response' });
    }

    return res.status(200).json({ message: content });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unexpected server error' });
  }
}
