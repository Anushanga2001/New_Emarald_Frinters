import api from './api'

export interface RatingResponse {
  id: number
  stars: number
  comment: string | null
  customerName?: string | null
  createdAt: string
  updatedAt: string | null
}

export interface CreateRatingRequest {
  stars: number
  comment?: string | null
}

export async function getRatings(): Promise<RatingResponse[]> {
  const response = await api.get<RatingResponse[]>('/ratings')
  return response.data
}

export async function getMyRating(): Promise<RatingResponse | null> {
  const response = await api.get<RatingResponse | null>('/ratings/me')
  return response.data ?? null
}

export async function submitRating(data: CreateRatingRequest): Promise<RatingResponse> {
  const response = await api.post<RatingResponse>('/ratings', data)
  return response.data
}
