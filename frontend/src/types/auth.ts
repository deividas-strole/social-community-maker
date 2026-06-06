export type User = {
  id: number
  email: string
  username: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  createdAt: string
}

export type RegisterRequest = {
  email: string
  username: string
  displayName: string
  password: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  tokenType: string
  user: User
}
