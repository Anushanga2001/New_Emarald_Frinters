import api from './api'

export interface ProfileDto {
  id: number
  name: string
  email: string
  phone?: string
  companyName?: string
  createdAt: string
}

export interface UpdateProfileRequest {
  name: string
  email: string
  phone?: string
  companyName?: string
}

export interface ProfileResponseDto {
  success: boolean
  message: string
  profile?: ProfileDto
}

export const profileApi = {
  getProfile: async (): Promise<ProfileDto> => {
    const response = await api.get<ProfileDto>('/profile')
    return response.data
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponseDto> => {
    const response = await api.put<ProfileResponseDto>('/profile', data)

    // Update localStorage user data after successful profile update
    // Note: localStorage errors are non-critical - profile update already succeeded on server
    if (response.data.success && response.data.profile) {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)
          // Update name (split into firstName/lastName for consistency)
          const nameParts = response.data.profile.name.split(' ', 2)
          user.firstName = nameParts[0]
          user.lastName = nameParts.length > 1 ? nameParts[1] : ''
          user.email = response.data.profile.email
          localStorage.setItem('user', JSON.stringify(user))
        }
      } catch {
        // localStorage unavailable or corrupted - non-critical, server update succeeded
        console.warn('Failed to update localStorage user data')
      }
    }

    return response.data
  },
}
