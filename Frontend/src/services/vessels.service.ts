import api from './api'

export interface Vessel {
  mmsi: number
  name?: string | null
  lat: number
  lng: number
  cog: number
  sog: number
  shipType?: number | null
  timestamp: number
}

export const vesselsService = {
  async getSnapshot(): Promise<Vessel[]> {
    const { data } = await api.get<Vessel[]>('/vessels')
    return data
  },

  async getTracked(): Promise<number[]> {
    const { data } = await api.get<number[]>('/vessels/track')
    return data
  },

  async addTracked(mmsi: number): Promise<void> {
    await api.post('/vessels/track', { mmsi })
  },

  async removeTracked(mmsi: number): Promise<void> {
    await api.delete(`/vessels/track/${mmsi}`)
  },
}
