import axios from 'axios'
import type { Community, CreateCommunityRequest } from '../types/community'

const API_BASE_URL = 'http://localhost:8080/api'

function getAuthToken(): string {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('User is not authenticated')
  }

  return token
}

export async function createCommunity(data: CreateCommunityRequest): Promise<Community> {
  const token = getAuthToken()

  const response = await axios.post<Community>(`${API_BASE_URL}/communities`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export async function getMyCommunities(): Promise<Community[]> {
  const token = getAuthToken()

  const response = await axios.get<Community[]>(`${API_BASE_URL}/communities/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export async function getPublicCommunities(): Promise<Community[]> {
  const response = await axios.get<Community[]>(`${API_BASE_URL}/communities`)
  return response.data
}

export async function getCommunityBySlug(slug: string): Promise<Community> {
  const response = await axios.get<Community>(`${API_BASE_URL}/communities/${slug}`)
  return response.data
}
