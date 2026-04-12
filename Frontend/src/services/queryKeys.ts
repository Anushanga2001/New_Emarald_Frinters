export const queryKeys = {
  notifications: {
    all: ['notifications'] as const,
    list: (page?: number) => [...queryKeys.notifications.all, 'list', page] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
  },
  quotes: ['quotes'] as const,
  auth: {
    user: ['auth', 'user'] as const,
  },
} as const
