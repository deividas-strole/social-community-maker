import axios from 'axios'
import type { CreatePostRequest, Post } from '../types/post'

const API_BASE_URL = 'http://localhost:8080/api'

function getAuthToken(): string {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('User is not authenticated')
  }

  return token
}

export type LikeResponse = {
  postId: number
  likedByCurrentUser: boolean
  likeCount: number
}

export async function createPost(communityId: number, data: CreatePostRequest): Promise<Post> {
  const token = getAuthToken()

  const response = await axios.post<Post>(
    `${API_BASE_URL}/communities/${communityId}/posts`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

export async function getCommunityPosts(communityId: number): Promise<Post[]> {
  const token = localStorage.getItem('token')

  const response = await axios.get<Post[]>(`${API_BASE_URL}/communities/${communityId}/posts`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  })

  return response.data
}

export async function deletePost(postId: number): Promise<void> {
  const token = getAuthToken()

  await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function likePost(postId: number): Promise<LikeResponse> {
  const token = getAuthToken()

  const response = await axios.post<LikeResponse>(
    `${API_BASE_URL}/posts/${postId}/likes`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data
}

export async function unlikePost(postId: number): Promise<LikeResponse> {
  const token = getAuthToken()

  const response = await axios.delete<LikeResponse>(`${API_BASE_URL}/posts/${postId}/likes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
