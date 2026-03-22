import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/layout/Header';
import { getAccessToken } from '../services/apiConfig';

const TAXGPT_URL = 'https://api.ai.fileam.app/api/chat';

const SUGGESTED_QUESTIONS = [
  'What is the VAT rate on professional services in Nigeria?',
  'What expenses can I deduct as a business owner?',
  'How is withholding tax calculated on rent payments?',
  'What are the CIT rates for companies in Nigeria?',
  'When must a company register for VAT?',
  'What is the PAYE tax rate for employees?',
];

const SECTION_HEADERS = ['DIRECT ANSWER', 'KEY DETAILS', 'LEGAL SOURCE', 'ADDITIONAL INFORMATION'];

const genConversationId = () =>
  `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getUserId = () => {
  try {
    const data = JSON.parse(localStorage.getItem('userData') || '{}');
    return data.id || data.userId || data._id || data.enterpriseId || `user_${Date.now()}`;
  } catch {
    return `user_${Date.now()}`;
  }
};

// Render formatted AI response with section headers and bullet points
const FormattedMessage = ({ text }) => {
  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (SECTION_HEADERS.includes(trimmed)) {
      elements.push(
        <p key={i} className="text-xs font-bold text-brand uppercase tracking-wider mt-4 mb-1.5 first:mt-0">
          {trimmed}
        </p>
      );
    } else if (trimmed.startsWith('•')) {
      elements.push(
        <p key={i} className="text-sm text-gray-700 pl-3 leading-relaxed my-0.5">
          {trimmed}
        </p>
      );
    } else {
      elements.push(
        <p key={i} className="text-sm text-gray-700 leading-relaxed my-1">
          {trimmed}
        </p>
      );
    }
  });

  return <div>{elements}</div>;
};

const ThinkingIndicator = () => (
  <div className="flex items-center gap-1.5">
    <span className="text-xs text-gray-400">Researching tax code</span>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const BotAvatar = () => (
  <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
    <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  </div>
);

const TaxGPT = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState(genConversationId);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const userId = useRef(getUserId());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [input]);

  const sendMessage = useCallback(
    async (messageText) => {
      const text = (messageText || '').trim();
      if (!text || isStreaming) return;

      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      setInput('');
      setIsStreaming(true);
      setIsThinking(false);

      // Placeholder AI message
      setMessages((prev) => [...prev, { role: 'assistant', content: '', streaming: true }]);

      try {
        const token = getAccessToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(TAXGPT_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            id: conversationId,
            user_id: userId.current,
            message: { type: 'text', content: text },
          }),
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);

              if (event.type === 'tool_call') {
                setIsThinking(true);
              } else if (event.type === 'text_start') {
                setIsThinking(false);
                accumulatedText = event.content || '';
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: accumulatedText,
                    streaming: true,
                  };
                  return updated;
                });
              } else if (event.type === 'text_delta') {
                setIsThinking(false);
                accumulatedText += event.content || '';
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: accumulatedText,
                    streaming: true,
                  };
                  return updated;
                });
              } else if (event.type === 'final_result') {
                accumulatedText = event.content || accumulatedText;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: accumulatedText,
                    streaming: false,
                  };
                  return updated;
                });
              }
            } catch {
              // ignore JSON parse errors on individual events
            }
          }
        }
      } catch (err) {
        console.error('TaxGPT error:', err);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: 'Sorry, I encountered an error connecting to TaxGPT. Please try again.',
            streaming: false,
            error: true,
          };
          return updated;
        });
      } finally {
        setIsStreaming(false);
        setIsThinking(false);
      }
    },
    [conversationId, isStreaming]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleNewChat = () => {
    if (isStreaming) return;
    setMessages([]);
    setInput('');
    setConversationId(genConversationId());
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 shrink-0 border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-4">
            <button
              onClick={handleNewChat}
              disabled={isStreaming}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-brand hover:text-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {!isEmpty && (
              <div>
                <p className="text-xs font-medium text-gray-400 mb-2">Current Session</p>
                <div className="px-3 py-2 rounded-lg bg-brand/5 border border-brand/20">
                  <p className="text-xs text-brand font-medium truncate">
                    {messages[0]?.content || 'New conversation'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-amber-700 leading-relaxed">
                Based on Nigeria Tax Act 2025. Not legal advice.
              </p>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {isEmpty ? (
              /* Empty / welcome state */
              <div className="flex flex-col items-center justify-center h-full px-8 pb-16">
                <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">TaxGPT</h1>
                <p className="text-sm text-gray-400 mb-8 text-center max-w-sm leading-relaxed">
                  Ask any question about Nigerian tax law. Answers are grounded in the Nigeria Tax Act 2025.
                </p>

                <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      disabled={isStreaming}
                      className="text-left px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-brand hover:text-brand hover:bg-brand/5 transition-all leading-snug"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
                {messages.map((msg, idx) => {
                  const isLastMsg = idx === messages.length - 1;
                  const showThinking = isThinking && isLastMsg && msg.role === 'assistant' && !msg.content;

                  return (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && <BotAvatar />}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-brand text-white rounded-br-sm ml-10'
                            : 'bg-gray-50 border border-gray-200 rounded-bl-sm ml-3'
                        } ${msg.error ? 'border-red-200 bg-red-50' : ''}`}
                      >
                        {msg.role === 'user' ? (
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        ) : showThinking ? (
                          <ThinkingIndicator />
                        ) : msg.content ? (
                          <>
                            <FormattedMessage text={msg.content} />
                            {msg.streaming && (
                              <span className="inline-block w-0.5 h-4 bg-gray-400 animate-pulse ml-0.5 align-text-bottom rounded" />
                            )}
                          </>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 px-6 py-4 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Nigerian tax law..."
                  rows={1}
                  disabled={isStreaming}
                  className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isStreaming}
                  className="w-9 h-9 bg-brand text-white rounded-xl flex items-center justify-center hover:bg-brand-600 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed shrink-0"
                >
                  {isStreaming ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Press Enter to send · Shift+Enter for new line · Powered by Nigeria Tax Act 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxGPT;
