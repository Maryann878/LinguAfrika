import api from './api';

export interface ChatMessage {
  _id: string
  userId: string
  message: string
  response?: string
  language?: string
  messageType: 'user' | 'ai'
  createdAt: string
}

export const getChatHistory = async (limit: number = 50) => {
  try {
    const response = await api.get('/chat/history', {
      params: { limit }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get chat history');
  }
};

export const sendChatMessage = async (message: string, language?: string) => {
  try {
    const response = await api.post('/chat/message', {
      message,
      language
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};


