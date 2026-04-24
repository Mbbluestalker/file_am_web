/**
 * TAXGPT (AI BACKEND) API SERVICE
 *
 * The AI backend lives at https://api.ai.fileam.app and is separate from the
 * main enterprise backend. This service wraps the conversation history + feedback
 * endpoints. The streaming chat endpoint is called directly from the TaxGPT page
 * because it uses Server-Sent Events (not JSON).
 */

import { getAccessToken } from './apiConfig';

export const AI_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL || 'https://api.ai.fileam.app';
export const TAXGPT_CHAT_URL = `${AI_BASE_URL}/api/chat`;

const buildHeaders = (extra = {}) => {
  const token = getAccessToken();
  const headers = { 'Content-Type': 'application/json', ...extra };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const request = async (path, options = {}) => {
  const res = await fetch(`${AI_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options.headers),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.detail || json?.message || `Request failed (${res.status})`);
  return json;
};

/**
 * LIST CONVERSATIONS
 * @param {string} userId
 * @param {object} opts - { page, pageSize, startDate, endDate, sortBy, sortOrder }
 */
export const listConversations = async (userId, opts = {}) => {
  const params = new URLSearchParams({ user_id: userId });
  if (opts.page) params.set('page', opts.page);
  if (opts.pageSize) params.set('page_size', opts.pageSize);
  if (opts.startDate) params.set('start_date', opts.startDate);
  if (opts.endDate) params.set('end_date', opts.endDate);
  if (opts.sortBy) params.set('sort_by', opts.sortBy);
  if (opts.sortOrder) params.set('sort_order', opts.sortOrder);
  return request(`/api/conversations?${params}`, { method: 'GET' });
};

/**
 * GET CONVERSATION MESSAGES
 * Returns: { conversation_id, messages: [{ id, role, content, createdAt }] }
 */
export const getConversationMessages = async (conversationId) =>
  request(`/api/conversations/${encodeURIComponent(conversationId)}/messages`, { method: 'GET' });

/**
 * SUBMIT FEEDBACK
 * @param {object} payload - { user_id, conversation_id, message_id, rating: 'helpful'|'not_helpful', feedback_text? }
 */
export const submitFeedback = async (payload) =>
  request('/api/feedback', { method: 'POST', body: JSON.stringify(payload) });

export default {
  listConversations,
  getConversationMessages,
  submitFeedback,
};
