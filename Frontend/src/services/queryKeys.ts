export const queryKeys = {
  shipments: {
    all: ['shipments'] as const,
    lists: () => [...queryKeys.shipments.all, 'list'] as const,
    list: (filters?: string) => [...queryKeys.shipments.lists(), filters] as const,
    details: () => [...queryKeys.shipments.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.shipments.details(), id] as const,
    tracking: (trackingNumber: string) => [...queryKeys.shipments.all, 'tracking', trackingNumber] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    customer: (customerId: string | number) => ['invoices', 'customer', customerId] as const,
    detail: (id: string | number) => [...queryKeys.invoices.all, id] as const,
  },
  quotes: ['quotes'] as const,
  auth: {
    user: ['auth', 'user'] as const,
  },
} as const
