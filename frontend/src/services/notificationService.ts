import api from './api';

export interface Notification {
  _id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'course' | 'community'
  isRead: boolean
  link?: string
  metadata?: any
  createdAt: string
}

export const getNotifications = async (limit: number = 50, unreadOnly: boolean = false) => {
  try {
    const response = await api.get('/notifications', {
      params: { limit, unreadOnly }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get notifications');
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.put('/notifications/read-all');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete notification');
  }
};


