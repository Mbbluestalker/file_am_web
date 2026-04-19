import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import { getAccessToken } from '../services/apiConfig';
import {
  TAXGPT_CHAT_URL,
  listConversations,
  getConversationMessages,
  submitFeedback,
} from '../services/taxGptApi';

const SUGGESTED_QUESTIONS = [
  'What is the VAT rate on professional services in Nigeria?',
  'What expenses can I deduct as a business owner?',
  'How is withholding tax calculated on rent payments?',
  'What are the CIT rates for companies in Nigeria?',
  'When must a company register for VAT?',
  'What is the PAYE tax rate for employees?',
];

const SECTION_HEADERS = ['DIRECT ANSWER', 'KEY DETAILS', 'LEGAL SOURCE', 'ADDITIONAL INFORMATION'];

const genConversationId = () => `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getUserId = () => {
  try {
    const data = JSON.parse(localStorage.getItem('userData') || '{}');
    return data.id || data.userId || data._id || data.enterpriseId || `user_${Date.now()}`;
  } catch {
    return `user_${Date.now()}`;
  }
};

const relativeTime = (iso) => {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

const FormattedMessage = ({ text }) => {
  const lines = text.split('\n');
  const elements = [];
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (SECTION_HEADERS.includes(trimmed)) {
      elements.push(
        <p key={i} className="text-xs font-bold text-brand uppercase tracking-wider mt-4 mb-1.5 first:mt-0">{trimmed}</p>
      );
    } else if (trimmed.startsWith('•')) {
      elements.push(
        <p key={i} className="text-sm text-gray-700 pl-3 leading-relaxed my-0.5">{trimmed}</p>
      );
    } else {
      elements.push(
        <p key={i} className="text-sm text-gray-700 leading-relaxed my-1">{trimmed}</p>
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

const FeedbackButtons = ({ rating, onRate }) => (
  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <button
      onClick={() => onRate('helpful')}
      className={`p-1.5 rounded-lg transition-colors ${
        rating === 'helpful' ? 'bg-green-50 text-green-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
      }`}
      title="Helpful"
    >
      <svg className="w-3.5 h-3.5" fill={rating === 'helpful' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    </button>
    <button
      onClick={() => onRate('not_helpful')}
      className={`p-1.5 rounded-lg transition-colors ${
        rating === 'not_helpful' ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
      }`}
      title="Not helpful"
    >
      <svg className="w-3.5 h-3.5" fill={rating === 'not_helpful' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018a2 2 0 01.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
      </svg>
    </button>
  </div>
);

const ConversationItem = ({ conversation, isActive, onClick }) => {
  const preview = conversation.first_message_preview || conversation.last_message_preview || 'Untitled conversation';
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
        isActive
          ? 'bg-brand/5 border-brand/30'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <p className={`text-xs font-medium truncate ${isActive ? 'text-brand' : 'text-gray-800'}`}>
        {preview}
      </p>
      <p className="text-[10px] text-gray-400 mt-1">
        {conversation.message_count} msg{conversation.message_count === 1 ? '' : 's'}
        {' · '}
        {relativeTime(conversation.updated_at)}
      </p>
    </button>
  );
};

const TaxGPT = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState(genConversationId);
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [feedbackByMessageId, setFeedbackByMessageId] = useState({});
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const userId = useRef(getUserId());

  const loadConversations = useCallback(async () => {
    setConversationsLoading(true);
    try {
      const res = await listConversations(userId.current, { page: 1, pageSize: 30, sortBy: 'updated_at', sortOrder: 'desc' });
      setConversations(Array.isArray(res?.conversations) ? res.conversations : []);
    } catch (err) {
      console.error('Load conversations error:', err);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  }, [input]);

  const handleSelectConversation = async (convId) => {
    if (isStreaming || convId === conversationId) return;
    setHistoryLoading(true);
    try {
      const res = await getConversationMessages(convId);
      const list = Array.isArray(res?.messages) ? res.messages : [];
      setMessages(
        list.map((m) => ({
          id: m.id || null,
          role: m.role,
          content: m.content || '',
          streaming: false,
        }))
      );
      setConversationId(convId);
      setFeedbackByMessageId({});
    } catch (err) {
      console.error('Load conversation error:', err);
      toast.error('Failed to load conversation');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleNewChat = () => {
    if (isStreaming) return;
    setMessages([]);
    setInput('');
    setFeedbackByMessageId({});
    setConversationId(genConversationId());
  };

  const sendMessage = useCallback(
    async (messageText) => {
      const text = (messageText || '').trim();
      if (!text || isStreaming) return;

      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      setInput('');
      setIsStreaming(true);
      setIsThinking(false);

      setMessages((prev) => [...prev, { role: 'assistant', content: '', streaming: true }]);

      try {
        const token = getAccessToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(TAXGPT_CHAT_URL, {
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
        let capturedMessageId = null;

        const applyToLastAssistant = (updates) =>
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = { ...last, ...updates };
            return updated;
          });

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

              // Capture message_id from any event metadata
              const mid = event.metadata?.message_id || event.metadata?.id;
              if (mid && !capturedMessageId) {
                capturedMessageId = mid;
                applyToLastAssistant({ id: mid });
              }

              if (event.type === 'tool_call') {
                setIsThinking(true);
              } else if (event.type === 'text_start') {
                setIsThinking(false);
                accumulatedText = event.content || '';
                applyToLastAssistant({ content: accumulatedText, streaming: true });
              } else if (event.type === 'text_delta') {
                setIsThinking(false);
                accumulatedText += event.content || '';
                applyToLastAssistant({ content: accumulatedText, streaming: true });
              } else if (event.type === 'final_result') {
                accumulatedText = event.content || accumulatedText;
                applyToLastAssistant({ content: accumulatedText, streaming: false });
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
        // Refresh the sidebar so this conversation appears/updates
        loadConversations();
      }
    },
    [conversationId, isStreaming, loadConversations]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleFeedback = async (messageId, rating) => {
    if (!messageId) return;
    // Optimistic update
    const previous = feedbackByMessageId[messageId];
    setFeedbackByMessageId((prev) => ({ ...prev, [messageId]: rating }));
    try {
      await submitFeedback({
        user_id: userId.current,
        conversation_id: conversationId,
        message_id: messageId,
        rating,
      });
      toast.success(rating === 'helpful' ? 'Marked helpful' : 'Feedback recorded');
    } catch (err) {
      console.error('Feedback error:', err);
      toast.error('Could not save feedback');
      // Revert
      setFeedbackByMessageId((prev) => {
        const copy = { ...prev };
        if (previous) copy[messageId] = previous;
        else delete copy[messageId];
        return copy;
      });
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 shrink-0 border-r border-gray-100 flex flex-col bg-gray-50/50">
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
            <p className="text-xs font-medium text-gray-400 mb-2 px-1">Conversations</p>
            {conversationsLoading && conversations.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-xs text-gray-400 px-1 py-2">No prior conversations</p>
            ) : (
              <div className="space-y-1.5">
                {conversations.map((c) => (
                  <ConversationItem
                    key={c.conversation_id}
                    conversation={c}
                    isActive={c.conversation_id === conversationId}
                    onClick={() => handleSelectConversation(c.conversation_id)}
                  />
                ))}
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
          <div className="flex-1 overflow-y-auto">
            {historyLoading ? (
              <div className="flex items-center justify-center h-full">
                <svg className="animate-spin h-8 w-8 text-brand" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : isEmpty ? (
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
                  const canRate = msg.role === 'assistant' && msg.id && !msg.streaming && !msg.error;
                  const currentRating = canRate ? feedbackByMessageId[msg.id] : null;

                  return (
                    <div
                      key={idx}
                      className={`group flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && <BotAvatar />}

                      <div className="flex flex-col">
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
                        {canRate && (
                          <div className="ml-3">
                            <FeedbackButtons
                              rating={currentRating}
                              onRate={(rating) => handleFeedback(msg.id, rating)}
                            />
                          </div>
                        )}
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
