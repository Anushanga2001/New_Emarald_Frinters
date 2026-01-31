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

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  customerId?: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}
