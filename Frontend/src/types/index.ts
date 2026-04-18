export type QuoteStatus = 'Pending' | 'Approved' | 'Rejected'

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
  status?: QuoteStatus
  customerName?: string | null
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
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
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
