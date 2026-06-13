import axios from 'axios'
import type { UserProfile } from './profileTypes'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type UpdateProfileRequest = {
  displayName: string
  bio: string
  avatarUrl: string
}

export async function getUserProfile(username: string): Promise<UserProfile> {
  const response = await axios.get<UserProfile>(`${API_BASE_URL}/users/${username}`)

  return response.data
}

export async function updateMyProfile(data: UpdateProfileRequest): Promise<UserProfile> {
  const token = localStorage.getItem('token')

  const response = await axios.put<UserProfile>(`${API_BASE_URL}/users/me/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export async function uploadMyAvatar(file: File): Promise<UserProfile> {
  const token = localStorage.getItem('token')

  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post<UserProfile>(`${API_BASE_URL}/images/avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
