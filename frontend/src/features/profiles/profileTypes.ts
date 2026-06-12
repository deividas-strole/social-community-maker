export type ProfileCommunity = {
  id: number
  name: string
  slug: string
  description: string
  visibility: 'PUBLIC' | 'PRIVATE'
  createdAt: string
}

export type ProfilePost = {
  id: number
  communityId: number
  communityName: string
  communitySlug: string
  content: string
  createdAt: string
  updatedAt: string | null
}

export type UserProfile = {
  id: number
  email: string
  username: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  createdAt: string
  ownedCommunities: ProfileCommunity[]
  joinedCommunities: ProfileCommunity[]
  recentPosts: ProfilePost[]
}
