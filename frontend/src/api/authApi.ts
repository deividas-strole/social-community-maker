import axios from 'axios'
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/auth'

const API_BASE_URL = 'http://localhost:8080/api'

export async function registerUser(data: RegisterRequest): Promise<User> {
  const response = await axios.post<User>(`${API_BASE_URL}/auth/register`, data)
  return response.data
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, data)
  return response.data
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await axios.get<User>(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
