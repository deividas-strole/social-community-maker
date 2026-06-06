import type { User } from './auth'

export type CommunityVisibility = 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY'

export type CreateCommunityRequest = {
  name: string
  slug: string
  description: string
  visibility: CommunityVisibility
}

export type CommunityOwner = Pick<User, 'id' | 'email' | 'username' | 'displayName'>

export type Community = {
  id: number
  name: string
  slug: string
  description: string | null
  visibility: CommunityVisibility
  owner: CommunityOwner
  createdAt: string
  updatedAt: string
}
