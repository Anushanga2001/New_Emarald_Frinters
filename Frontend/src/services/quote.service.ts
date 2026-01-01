import api from './api'
import type { Quote } from '@/types'

interface CalculateQuoteRequest {
  origin: string
  destination: string
  service: string
  cargoType: string
  weight: number
  containerSize?: string
  currency: 'USD' | 'LKR'
}

interface QuoteApiResponse {
  id?: number
  quoteNumber?: string
  origin: string
  destination: string
  service: string
  cargoType: string
  weight: number
  containerSize?: string
  price: number
  currency: string
  estimatedDays: number
  distance: number
  isBooked: boolean
  createdAt: string
}

// Transform API response to frontend Quote type
function mapApiResponseToQuote(response: QuoteApiResponse): Quote {
  return {
    id: response.quoteNumber || response.id?.toString(),
    origin: response.origin,
    destination: response.destination,
    service: response.service,
    cargoType: response.cargoType,
    weight: response.weight,
    containerSize: response.containerSize,
    price: response.price,
    currency: response.currency as 'USD' | 'LKR',
    estimatedDays: response.estimatedDays,
    createdAt: response.createdAt,
  }
}

export async function calculateQuote(quoteData: Omit<Quote, 'id' | 'price' | 'estimatedDays'>): Promise<Quote> {
  const request: CalculateQuoteRequest = {
    origin: quoteData.origin,
    destination: quoteData.destination,
    service: quoteData.service,
    cargoType: quoteData.cargoType,
    weight: quoteData.weight,
    containerSize: quoteData.containerSize,
    currency: quoteData.currency,
  }

  const response = await api.post<QuoteApiResponse>('/quotes/calculate', request)
  return mapApiResponseToQuote(response.data)
}

export async function saveQuote(quote: Quote): Promise<Quote> {
  const request = {
    origin: quote.origin,
    destination: quote.destination,
    service: quote.service,
    cargoType: quote.cargoType,
    weight: quote.weight,
    containerSize: quote.containerSize,
    price: quote.price,
    currency: quote.currency,
    estimatedDays: quote.estimatedDays,
  }

  const response = await api.post<QuoteApiResponse>('/quotes', request)
  return mapApiResponseToQuote(response.data)
}

export async function getUserQuotes(): Promise<Quote[]> {
  const response = await api.get<QuoteApiResponse[]>('/quotes')
  return response.data.map(mapApiResponseToQuote)
}
