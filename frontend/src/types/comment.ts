export type CommentAuthor = {
  id: number
  username: string
  displayName: string
}

export type Comment = {
  id: number
  postId: number
  author: CommentAuthor
  content: string
  createdAt: string
  updatedAt: string
}

export type CreateCommentRequest = {
  content: string
}
