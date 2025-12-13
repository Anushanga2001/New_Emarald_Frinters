export interface Shipment {
  id: string
  trackingNumber: string
  status: string
  origin: string
  destination: string
  currentLocation: string
  estimatedDelivery: string
  service: string
  weight: number
  timeline: ShipmentEvent[]
}

export interface ShipmentEvent {
  date: string
  status: string
  location: string
  description: string
}

export interface Quote {
  id?: string
  origin: string
  destination: string
  service: string
  cargoType: string
  weight: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  containerSize?: string
  price: number
  currency: 'LKR' | 'USD'
  estimatedDays: number
  createdAt?: string
}

export interface Booking {
  id?: string
  userId?: string
  origin: string
  destination: string
  service: string
  cargoType: string
  weight: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  containerSize?: string
  pickupDate: string
  pickupAddress: string
  deliveryAddress: string
  contactName: string
  contactPhone: string
  contactEmail: string
  specialInstructions?: string
  documents?: File[]
  status: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  address?: string
  createdAt: string
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}
