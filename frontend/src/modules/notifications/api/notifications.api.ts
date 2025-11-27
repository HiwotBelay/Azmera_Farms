import { apiClient } from '@/lib/api-client';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: string;
  emailSent: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
}

export interface UnreadCountResponse {
  count: number;
}

export const notificationsApi = {
  getAll: async (unreadOnly = false): Promise<Notification[]> => {
    const response = await apiClient.instance.get<Notification[]>(
      `/notifications${unreadOnly ? '?unreadOnly=true' : ''}`,
    );
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.instance.get<UnreadCountResponse>(
      '/notifications/unread-count',
    );
    return response.data.count;
  },

  getById: async (id: string): Promise<Notification> => {
    const response = await apiClient.instance.get<Notification>(`/notifications/${id}`);
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.instance.put<Notification>(
      `/notifications/${id}/read`,
      {},
    );
    return response.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.instance.put('/notifications/mark-all-read', {});
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.instance.delete(`/notifications/${id}`);
  },
};

