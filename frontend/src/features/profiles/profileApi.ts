import axios from 'axios'
import type { UserProfile } from './profileTypes'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getUserProfile(username: string): Promise<UserProfile> {
  const response = await axios.get<UserProfile>(`${API_BASE_URL}/users/${username}`)

  return response.data
}
