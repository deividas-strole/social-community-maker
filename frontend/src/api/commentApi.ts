import axios from 'axios'
import type { Comment, CreateCommentRequest } from '../types/comment'

const API_BASE_URL = 'http://localhost:8080/api'

function getAuthToken(): string {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('User is not authenticated')
  }

  return token
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

export async function deleteComment(commentId: number): Promise<void> {
  const token = getAuthToken()

  await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
