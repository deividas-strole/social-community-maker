export type PostAuthor = {
  id: number
  username: string
  displayName: string
}

export type Post = {
  id: number
  communityId: number
  author: PostAuthor
  content: string
  imageUrl: string | null
  likeCount: number
  commentCount: number
  likedByCurrentUser: boolean
  createdAt: string
  updatedAt: string
}

export type CreatePostRequest = {
  content: string
  imageUrl?: string
}
