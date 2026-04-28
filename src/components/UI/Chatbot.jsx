import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import salesScriptRaw from '../../../sales_script.md?raw';
import './Chatbot.css';

const parseScriptSection = (heading) => {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`## ${escapedHeading}\\n([\\s\\S]*?)(?=\\n## |$)`);
  const match = salesScriptRaw.match(pattern);
  return match ? match[1].trim() : '';
};

const extractQuotedText = (text) => {
  const match = text.match(/"([\s\S]*?)"/);
  return match ? match[1].trim() : text.trim();
};

const parseFaqs = () => {
  const faqSection = parseScriptSection('2. 10 câu hỏi khách hay hỏi nhất');
  const blocks = faqSection.split(/\n(?=\d+\. \*\*Hỏi: )/).filter(Boolean);

  return blocks.map((block) => {
    const questionMatch = block.match(/\*\*Hỏi:\s*"([\s\S]*?)"\*\*/);
    const answerMatch = block.match(/\*\*Cherry đáp:\*\*\s*"([\s\S]*?)"/);

    return {
      question: questionMatch ? questionMatch[1].trim() : '',
      answer: answerMatch ? answerMatch[1].trim() : '',
    };
  }).filter((item) => item.question && item.answer);
};

const normalizeText = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

const KEYWORD_GROUPS = [
  { keywords: ['beo cam', 'beo ao', 'ngoai ao', 'beo'], faqIndex: 0 },
  { keywords: ['rua', 'nau chin', 'an song', 'mo hop'], faqIndex: 1 },
  { keywords: ['dang', 'mui co', 'de an', 'vi no', 'mui'], faqIndex: 2 },
  { keywords: ['tanh', 'mui bun', 'hang mui bun'], faqIndex: 3 },
  { keywords: ['an dam', '6-8 thang', 'tre nho', 'be', 'em be'], faqIndex: 4 },
  { keywords: ['giun san', 'an toan', 'khong sach', 'duoi nuoc'], faqIndex: 5 },
  { keywords: ['goi nao', 'combo nao', 'bat dau', 'gia bao nhieu', '49k', 'gia'], faqIndex: 6 },
  { keywords: ['giao nhanh', 'hoa toc', 'ship', 'tphcm', 'giao trong ngay'], faqIndex: 7 },
  { keywords: ['bao quan', 'tu lanh', 'ngan mat', 'de duoc bao lau'], faqIndex: 8 },
  { keywords: ['dat', 'cao', 'rau ngoai cho'], faqIndex: 9 },
];

const BUY_KEYWORDS = ['mua', 'chot', 'lay combo', 'lay 1 hop', 'dat hang', 'quan tam', 'muon thu'];
const HESITATE_KEYWORDS = ['nghi them', 'de em xem', 'de minh xem', 'chua san sang', 'phan van', 'can nhac'];

const buildBotReply = (message, faqs, closeMessage, waitlistMessage) => {
  const normalizedMessage = normalizeText(message);

  if (BUY_KEYWORDS.some((keyword) => normalizedMessage.includes(keyword))) {
    return {
      text: closeMessage,
      showLeadButton: true,
    };
  }

  if (HESITATE_KEYWORDS.some((keyword) => normalizedMessage.includes(keyword))) {
    return {
      text: waitlistMessage,
      showLeadButton: true,
    };
  }

  const matchedGroup = KEYWORD_GROUPS.find((group) =>
    group.keywords.some((keyword) => normalizedMessage.includes(keyword))
  );

  if (matchedGroup && faqs[matchedGroup.faqIndex]) {
    return {
      text: faqs[matchedGroup.faqIndex].answer,
      showLeadButton: matchedGroup.faqIndex >= 6,
    };
  }

  return {
    text: 'Cherry hiểu nè. Nếu chị muốn, cứ hỏi Cherry về giá, cách dùng cho bé, giao hàng, bảo quản hoặc cứ nói thẳng là chị đang phân vân chỗ nào, em trả lời gọn cho mình luôn.',
    showLeadButton: false,
  };
};

export const Chatbot = () => {
  const greeting = useMemo(() => extractQuotedText(parseScriptSection('1. Câu chào khách')), []);
  const faqs = useMemo(() => parseFaqs(), []);
  const closeMessage = useMemo(() => extractQuotedText(parseScriptSection('3. Câu chốt đơn khi khách có vẻ quan tâm')), []);
  const waitlistMessage = useMemo(() => extractQuotedText(parseScriptSection('4. Câu hướng khách điền form khi chưa sẵn sàng mua ngay')), []);

  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([{ type: 'bot', text: greeting }]);
      }, 250);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [greeting, isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const scrollToLeadForm = () => {
    setIsOpen(false);
    document.getElementById('gift-survey')?.scrollIntoView({ behavior: 'smooth' });
  };

  const shouldShowLeadButton = (userText, botText) => {
    const combined = normalizeText(`${userText} ${botText}`);

    return [
      'form',
      'danh sach cho',
      'de lai',
      'muon thu',
      'mua ngay',
      'combo 3',
      'combo 5',
      'hop dung thu',
    ].some((keyword) => combined.includes(keyword));
  };

  const sendUserMessage = async (text) => {
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;

    setMessages((prev) => [...prev, { type: 'user', text: trimmedText }]);
    setDraft('');
    setIsLoading(true);

    const conversation = [
      ...messages,
      { type: 'user', text: trimmedText },
    ].map((message) => ({
      role: message.type === 'bot' ? 'assistant' : 'user',
      content: message.text,
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversation }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.message) {
        throw new Error(payload?.error || 'Chat request failed');
      }

      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: payload.message,
          showLeadButton: shouldShowLeadButton(trimmedText, payload.message),
        },
      ]);
    } catch {
      const reply = buildBotReply(trimmedText, faqs, closeMessage, waitlistMessage);

      window.setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: reply.text,
            showLeadButton: reply.showLeadButton,
          },
        ]);
      }, 250);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendUserMessage(draft);
  };

  const suggestedQuestions = faqs.slice(0, 5);

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button
          type="button"
          className="chatbot-bubble"
          onClick={() => setIsOpen(true)}
          aria-label="Mở chatbot tư vấn"
        >
          <span className="chatbot-badge">
            <strong>24/7</strong>
            <small>Chat</small>
          </span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window" role="dialog" aria-label="Chatbot tư vấn Wolffia">
          <div className="chatbot-header">
            <div>
              <h3>Cherry tu van 24/7</h3>
              <p>Hoi nhanh de Cherry tra loi lien</p>
            </div>
            <button type="button" className="close-btn" onClick={() => setIsOpen(false)} aria-label="Đóng chatbot">
              <FaTimes size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={`${message.type}-${index}`} className={`message ${message.type}`}>
                <p>{message.text}</p>
                {message.type === 'bot' && message.showLeadButton && (
                  <button type="button" className="message-cta" onClick={scrollToLeadForm}>
                    Di den form danh sach cho
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-options">
            <span className="options-label">Goi y de thu nhanh</span>
            <div className="option-list">
              {suggestedQuestions.map((item) => (
                <button
                  key={item.question}
                  type="button"
                  className="option-btn"
                  onClick={() => {
                    void sendUserMessage(item.question);
                  }}
                >
                  {item.question}
                </button>
              ))}
              <button type="button" className="option-btn option-btn-highlight" onClick={() => {
                void sendUserMessage('Mình muốn mua ngay');
              }}>
                Minh muon mua ngay
              </button>
              <button type="button" className="option-btn" onClick={() => {
                void sendUserMessage('Để mình nghĩ thêm');
              }}>
                De minh nghi them
              </button>
            </div>
          </div>

          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Vi du: gia bao nhieu, co hop cho be khong..."
              aria-label="Nhập câu hỏi cho chatbot"
              disabled={isLoading}
            />
            <button type="submit" aria-label="Gửi câu hỏi" disabled={isLoading}>
              <FaPaperPlane size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
