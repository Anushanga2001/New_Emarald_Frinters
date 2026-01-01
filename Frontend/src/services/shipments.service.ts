import api from './api'

export interface ShipmentResponse {
  id: number
  trackingNumber: string
  customerId: number
  originAddress: string
  originCity: string
  originState: string
  originZipCode: string
  destinationAddress: string
  destinationCity: string
  destinationState: string
  destinationZipCode: string
  status: number
  weight: number
  distance: number
  serviceType: number
  estimatedDeliveryDate: string
  actualDeliveryDate: string | null
  specialInstructions: string | null
  createdAt: string
  trackingEvents: TrackingEventDto[]
  packages: PackageDto[]
}

interface TrackingEventDto {
  id: number
  status: number
  location: string
  description: string
  eventDate: string
}

interface PackageDto {
  weight: number
  length: number
  width: number
  height: number
  description: string
}

// Status constants matching backend
export const ShipmentStatus = {
  Pending: 1,
  PickedUp: 2,
  InTransit: 3,
  OutForDelivery: 4,
  Delivered: 5,
  Cancelled: 6
} as const

export type ShipmentStatusType = typeof ShipmentStatus[keyof typeof ShipmentStatus]

// Helper to get status label
export function getStatusLabel(status: number): string {
  const labels: Record<number, string> = {
    [ShipmentStatus.Pending]: 'Pending',
    [ShipmentStatus.PickedUp]: 'Picked Up',
    [ShipmentStatus.InTransit]: 'In Transit',
    [ShipmentStatus.OutForDelivery]: 'Out For Delivery',
    [ShipmentStatus.Delivered]: 'Delivered',
    [ShipmentStatus.Cancelled]: 'Cancelled',
  }
  return labels[status] || 'Unknown'
}

export async function getCustomerShipments(): Promise<ShipmentResponse[]> {
  const response = await api.get('/shipments')
  return response.data
}

export function getShipmentStats(shipments: ShipmentResponse[]) {
  return {
    total: shipments.length,
    inTransit: shipments.filter(s => 
      s.status === ShipmentStatus.InTransit || 
      s.status === ShipmentStatus.PickedUp ||
      s.status === ShipmentStatus.OutForDelivery
    ).length,
    delivered: shipments.filter(s => s.status === ShipmentStatus.Delivered).length,
    pending: shipments.filter(s => s.status === ShipmentStatus.Pending).length,
  }
}
