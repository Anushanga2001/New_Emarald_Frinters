// import api from './api'
import type { Shipment } from '@/types'

// Mock data for demonstration
const MOCK_SHIPMENTS: Record<string, Shipment> = {
  'LS2024001': {
    id: '1',
    trackingNumber: 'LS2024001',
    status: 'in-transit',
    origin: 'Singapore',
    destination: 'Colombo, Sri Lanka',
    currentLocation: 'Indian Ocean',
    estimatedDelivery: '2024-12-05',
    service: 'Sea Freight (FCL)',
    weight: 15000,
    timeline: [
      {
        date: '2024-11-20T08:00:00Z',
        status: 'booked',
        location: 'Singapore',
        description: 'Shipment booked successfully',
      },
      {
        date: '2024-11-21T14:30:00Z',
        status: 'picked-up',
        location: 'Singapore Port',
        description: 'Container picked up from shipper',
      },
      {
        date: '2024-11-22T10:00:00Z',
        status: 'in-transit',
        location: 'Singapore Port',
        description: 'Loaded on vessel MV Ocean Pearl',
      },
      {
        date: '2024-11-25T16:00:00Z',
        status: 'in-transit',
        location: 'Indian Ocean',
        description: 'En route to Colombo',
      },
    ],
  },
  'LS2024002': {
    id: '2',
    trackingNumber: 'LS2024002',
    status: 'delivered',
    origin: 'Dubai, UAE',
    destination: 'Kandy, Sri Lanka',
    currentLocation: 'Delivered',
    estimatedDelivery: '2024-11-22',
    service: 'Air Freight',
    weight: 250,
    timeline: [
      {
        date: '2024-11-18T09:00:00Z',
        status: 'booked',
        location: 'Dubai',
        description: 'Shipment booked',
      },
      {
        date: '2024-11-19T12:00:00Z',
        status: 'in-transit',
        location: 'Dubai Airport',
        description: 'Departed from Dubai',
      },
      {
        date: '2024-11-20T05:00:00Z',
        status: 'at-port',
        location: 'Colombo Airport',
        description: 'Arrived at Colombo Airport',
      },
      {
        date: '2024-11-20T14:00:00Z',
        status: 'customs',
        location: 'Colombo Customs',
        description: 'Customs clearance in progress',
      },
      {
        date: '2024-11-21T10:00:00Z',
        status: 'out-for-delivery',
        location: 'Colombo',
        description: 'Out for delivery to Kandy',
      },
      {
        date: '2024-11-22T15:30:00Z',
        status: 'delivered',
        location: 'Kandy',
        description: 'Successfully delivered to recipient',
      },
    ],
  },
}

export async function trackShipment(trackingNumber: string): Promise<Shipment> {
  // In production, replace with real API call
  // return api.get(`/shipments/track/${trackingNumber}`).then(res => res.data)
  
  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shipment = MOCK_SHIPMENTS[trackingNumber]
      if (shipment) {
        resolve(shipment)
      } else {
        reject(new Error('Shipment not found'))
      }
    }, 1000)
  })
}

export async function trackMultipleShipments(trackingNumbers: string[]): Promise<Shipment[]> {
  return Promise.all(trackingNumbers.map(trackShipment))
}
