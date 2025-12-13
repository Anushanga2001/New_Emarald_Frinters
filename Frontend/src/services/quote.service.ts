// import api from './api'
import type { Quote } from '@/types'

const BASE_RATES = {
  'sea-freight-fcl': 1500, // USD per container
  'sea-freight-lcl': 80, // USD per CBM
  'air-freight': 5, // USD per kg
  'land-transport': 0.5, // USD per kg
}

const ROUTE_MULTIPLIERS: Record<string, number> = {
  'Asia': 1.0,
  'Middle East': 1.2,
  'Europe': 1.8,
  'North America': 2.2,
  'Africa': 1.5,
  'Australia': 1.4,
}

export async function calculateQuote(quoteData: Omit<Quote, 'id' | 'price' | 'estimatedDays'>): Promise<Quote> {
  // In production, replace with real API call
  // return api.post('/quotes/calculate', quoteData).then(res => res.data)
  
  // Mock calculation
  return new Promise((resolve) => {
    setTimeout(() => {
      let price = 0
      let estimatedDays = 0
      
      const serviceKey = quoteData.service.toLowerCase().replace(/\s/g, '-').replace(/[()]/g, '')
      const baseRate = BASE_RATES[serviceKey as keyof typeof BASE_RATES] || 100
      
      // Calculate based on service type
      if (serviceKey.includes('fcl')) {
        price = baseRate * (ROUTE_MULTIPLIERS[getRegion(quoteData.destination)] || 1.5)
        estimatedDays = 14
      } else if (serviceKey.includes('lcl')) {
        const cbm = (quoteData.weight / 167) // Rough CBM calculation
        price = baseRate * cbm * (ROUTE_MULTIPLIERS[getRegion(quoteData.destination)] || 1.5)
        estimatedDays = 18
      } else if (serviceKey.includes('air')) {
        price = baseRate * quoteData.weight * (ROUTE_MULTIPLIERS[getRegion(quoteData.destination)] || 1.3)
        estimatedDays = 3
      } else {
        price = baseRate * quoteData.weight
        estimatedDays = 1
      }
      
      // Convert USD to LKR if needed (mock rate: 1 USD = 320 LKR)
      const finalPrice = quoteData.currency === 'LKR' ? price * 320 : price
      
      resolve({
        ...quoteData,
        id: `Q${Date.now()}`,
        price: Math.round(finalPrice * 100) / 100,
        estimatedDays,
        createdAt: new Date().toISOString(),
      })
    }, 800)
  })
}

function getRegion(destination: string): string {
  const dest = destination.toLowerCase()
  if (dest.includes('india') || dest.includes('china') || dest.includes('singapore') || dest.includes('japan')) {
    return 'Asia'
  } else if (dest.includes('dubai') || dest.includes('uae') || dest.includes('saudi')) {
    return 'Middle East'
  } else if (dest.includes('uk') || dest.includes('germany') || dest.includes('europe')) {
    return 'Europe'
  } else if (dest.includes('usa') || dest.includes('canada') || dest.includes('america')) {
    return 'North America'
  } else if (dest.includes('australia') || dest.includes('sydney')) {
    return 'Australia'
  }
  return 'Asia'
}

export async function saveQuote(quote: Quote): Promise<Quote> {
  // In production: api.post('/quotes', quote)
  return Promise.resolve({ ...quote, id: `Q${Date.now()}` })
}

export async function getUserQuotes(_userId: string): Promise<Quote[]> {
  // In production: api.get(`/users/${_userId}/quotes`)
  return Promise.resolve([])
}
