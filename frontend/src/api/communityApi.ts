import axios from 'axios'
import type { Community, CreateCommunityRequest, MyCommunitiesResponse } from '../types/community'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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

export async function getMyCommunities(): Promise<MyCommunitiesResponse> {
  const token = getAuthToken()

  const response = await axios.get<MyCommunitiesResponse>(`${API_BASE_URL}/communities/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export async function getPublicCommunities(search = ''): Promise<Community[]> {
  const params = search.trim() ? { search: search.trim() } : undefined

  const response = await axios.get<Community[]>(`${API_BASE_URL}/communities`, {
    params,
  })

  return response.data
}

export async function getCommunityBySlug(slug: string): Promise<Community> {
  const token = localStorage.getItem('token')

  const response = await axios.get<Community>(`${API_BASE_URL}/communities/${slug}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  })

  return response.data
}

export async function joinCommunity(communityId: number): Promise<void> {
  const token = getAuthToken()

  await axios.post(
    `${API_BASE_URL}/communities/${communityId}/join`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

export async function leaveCommunity(communityId: number): Promise<void> {
  const token = getAuthToken()

  await axios.delete(`${API_BASE_URL}/communities/${communityId}/leave`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
