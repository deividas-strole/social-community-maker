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
  likeCount: number
  commentCount: number
  likedByCurrentUser: boolean
  createdAt: string
  updatedAt: string
}

export type CreatePostRequest = {
  content: string
}
