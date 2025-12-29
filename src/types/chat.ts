export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface WebhookPayload {
  message: string;
  timestamp: string;
  sessionId: string;
}
