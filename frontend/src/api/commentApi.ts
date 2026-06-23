import axios from 'axios'
import type { Comment, CreateCommentRequest } from '../types/comment'
import type { Post } from '../types/post.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getAuthToken(): string {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('User is not authenticated')
  }

  return token
}

export type UpdateCommentRequest = {
  content: string
}

export type UpdatePostRequest = {
  content: string
  imageUrl?: string
}

export async function getPostComments(postId: number): Promise<Comment[]> {
  const response = await axios.get<Comment[]>(`${API_BASE_URL}/posts/${postId}/comments`)

  return response.data
}

export async function createComment(postId: number, data: CreateCommentRequest): Promise<Comment> {
  const token = getAuthToken()

  const response = await axios.post<Comment>(`${API_BASE_URL}/posts/${postId}/comments`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export async function updateComment(
  commentId: number,
  data: UpdateCommentRequest
): Promise<Comment> {
  const token = getAuthToken()

  const response = await axios.put<Comment>(`${API_BASE_URL}/comments/${commentId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export async function deleteComment(commentId: number): Promise<void> {
  const token = getAuthToken()

  await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function updatePost(postId: number, data: UpdatePostRequest): Promise<Post> {
  const token = getAuthToken()

  const response = await axios.put<Post>(`${API_BASE_URL}/posts/${postId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
