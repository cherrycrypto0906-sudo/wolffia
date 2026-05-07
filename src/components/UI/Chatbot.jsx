import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './Chatbot.css';

const normalizeText = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

const KEYWORD_GROUPS = [
  { keywords: ['beo cam', 'beo ao', 'ngoai ao', 'beo', 'what exactly', 'is this'], faqIndex: 0 },
  { keywords: ['rua', 'nau chin', 'an song', 'mo hop', 'wash', 'cook'], faqIndex: 1 },
  { keywords: ['dang', 'mui co', 'de an', 'vi no', 'mui', 'bitter', 'smell', 'taste'], faqIndex: 2 },
  { keywords: ['tanh', 'mui bun', 'hang mui bun', 'fishy', 'muddy'], faqIndex: 3 },
  { keywords: ['an dam', '6-8 thang', 'tre nho', 'be', 'em be', 'baby', 'babies', 'kids'], faqIndex: 4 },
  { keywords: ['giun san', 'an toan', 'khong sach', 'duoi nuoc', 'parasites', 'water', 'safe'], faqIndex: 5 },
  { keywords: ['goi nao', 'combo nao', 'bat dau', 'gia bao nhieu', '49k', 'gia', 'price', 'package', 'start'], faqIndex: 6 },
  { keywords: ['giao nhanh', 'hoa toc', 'ship', 'tphcm', 'giao trong ngay', 'delivery', 'fast', 'same-day'], faqIndex: 7 },
  { keywords: ['bao quan', 'tu lanh', 'ngan mat', 'de duoc bao lau', 'store', 'fridge'], faqIndex: 8 },
  { keywords: ['dat', 'cao', 'rau ngoai cho', 'expensive', 'vegetables'], faqIndex: 9 },
];

const BUY_KEYWORDS = ['mua', 'chot', 'lay combo', 'lay 1 hop', 'dat hang', 'quan tam', 'muon thu', 'buy', 'order', 'interested', 'try'];
const HESITATE_KEYWORDS = ['nghi them', 'de em xem', 'de minh xem', 'chua san sang', 'phan van', 'can nhac', 'think about it', 'not ready'];

const buildBotReply = (message, faqs, closeMessage, waitlistMessage, fallbackMessage) => {
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
    text: fallbackMessage,
    showLeadButton: false,
  };
};

export const Chatbot = () => {
  const { t } = useTranslation();
  
  const greeting = t('chatbot.greeting');
  const closeMessage = t('chatbot.closeMessage');
  const waitlistMessage = t('chatbot.waitlistMessage');
  const fallbackMessage = t('chatbot.fallback');
  const faqsRaw = t('chatbot.faqs', { returnObjects: true });
  const faqs = Array.isArray(faqsRaw) ? faqsRaw : [];

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
      'waitlist',
      'leave',
      'try',
      'buy now',
      'trial box',
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
      const reply = buildBotReply(trimmedText, faqs, closeMessage, waitlistMessage, fallbackMessage);

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
          aria-label={t('chatbot.header.title')}
        >
          <span className="chatbot-badge">
            <strong>24/7</strong>
            <small>Chat</small>
          </span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window" role="dialog" aria-label={t('chatbot.header.title')}>
          <div className="chatbot-header">
            <div>
              <h3>{t('chatbot.header.title')}</h3>
              <p>{t('chatbot.header.subtitle')}</p>
            </div>
            <button type="button" className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close">
              <FaTimes size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={`${message.type}-${index}`} className={`message ${message.type}`}>
                <p>{message.text}</p>
                {message.type === 'bot' && message.showLeadButton && (
                  <button type="button" className="message-cta" onClick={scrollToLeadForm}>
                    {t('chatbot.messages.ctaLeadForm')}
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-options">
            <span className="options-label">{t('chatbot.options.label')}</span>
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
                void sendUserMessage(t('chatbot.options.buyNow'));
              }}>
                {t('chatbot.options.buyNow')}
              </button>
              <button type="button" className="option-btn" onClick={() => {
                void sendUserMessage(t('chatbot.options.thinkMore'));
              }}>
                {t('chatbot.options.thinkMore')}
              </button>
            </div>
          </div>

          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t('chatbot.input.placeholder')}
              aria-label={t('chatbot.input.placeholder')}
              disabled={isLoading}
            />
            <button type="submit" aria-label="Send" disabled={isLoading}>
              <FaPaperPlane size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
