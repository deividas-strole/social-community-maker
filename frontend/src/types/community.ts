import type { User } from './auth'

export type CommunityVisibility = 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY'
export type CommunityRole = 'OWNER' | 'ADMIN' | 'MEMBER'

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
  currentUserIsMember: boolean | null
  currentUserRole: CommunityRole | null
  createdAt: string
  updatedAt: string
}

export type MyCommunitiesResponse = {
  ownedCommunities: Community[]
  joinedCommunities: Community[]
}
