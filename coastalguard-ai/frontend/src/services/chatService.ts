import { apiRequest } from './api';
import type { Language } from '../types';

export interface ChatApiRequest {
  message: string;
  language: Language;
  contextBulletin?: string;
}

export interface ChatApiResponse {
  status: string;
  reply: string;
  language: string;
  model: string;
  timestamp: string;
  disclaimer: string;
  isLiveAi: boolean;
}

/**
 * Send a user inquiry to the backend Gemini AI safety assistant endpoint.
 */
export async function sendChatMessage(
  message: string,
  language: Language,
  contextBulletin?: string
): Promise<ChatApiResponse> {
  return apiRequest<ChatApiResponse>(
    '/api/chat',
    {
      method: 'POST',
      body: JSON.stringify({
        message,
        language,
        contextBulletin,
      }),
    },
    30000 // 30s timeout for LLM generation
  );
}
