import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getCommunityBySlug, joinCommunity, leaveCommunity } from '../api/communityApi'
import { createPost, deletePost, getCommunityPosts, likePost, unlikePost } from '../api/postApi'
import { createComment, deleteComment, getPostComments } from '../api/commentApi'
import type { Community } from '../types/community'
import type { Post } from '../types/post'
import type { User } from '../types/auth'
import type { Comment } from '../types/comment'

export default function CommunityPage() {
  const { slug } = useParams<{ slug: string }>()

  const [community, setCommunity] = useState<Community | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [commentsByPostId, setCommentsByPostId] = useState<Record<number, Comment[]>>({})
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({})
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const [postContent, setPostContent] = useState('')
  const [error, setError] = useState('')
  const [postError, setPostError] = useState('')
  const [commentError, setCommentError] = useState('')
  const [membershipError, setMembershipError] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)
  const [isSubmittingCommentPostId, setIsSubmittingCommentPostId] = useState<number | null>(null)
  const [isMembershipLoading, setIsMembershipLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser) as User)
      } catch {
        setCurrentUser(null)
      }
    }
  }, [])

  async function loadCommentsForPosts(loadedPosts: Post[]) {
    const commentEntries = await Promise.all(
      loadedPosts.map(async (post) => {
        const comments = await getPostComments(post.id)
        return [post.id, comments] as const
      })
    )

    setCommentsByPostId(Object.fromEntries(commentEntries))
  }

  async function reloadCommunityAndPosts() {
    if (!slug) {
      setError('Community slug is missing.')
      setIsLoading(false)
      return
    }

    try {
      const data = await getCommunityBySlug(slug)
      setCommunity(data)

      const communityPosts = await getCommunityPosts(data.id)
      setPosts(communityPosts)

      await loadCommentsForPosts(communityPosts)
    } catch {
      setError('Community could not be found.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    reloadCommunityAndPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const handleJoinCommunity = async () => {
    if (!community) {
      return
    }

    setMembershipError('')
    setIsMembershipLoading(true)

    try {
      await joinCommunity(community.id)
      await reloadCommunityAndPosts()
    } catch {
      setMembershipError('Could not join this community.')
    } finally {
      setIsMembershipLoading(false)
    }
  }

  const handleLeaveCommunity = async () => {
    if (!community) {
      return
    }

    const confirmed = window.confirm('Leave this community?')

    if (!confirmed) {
      return
    }

    setMembershipError('')
    setIsMembershipLoading(true)

    try {
      await leaveCommunity(community.id)
      await reloadCommunityAndPosts()
    } catch {
      setMembershipError('Could not leave this community.')
    } finally {
      setIsMembershipLoading(false)
    }
  }

  const handleCreatePost = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setPostError('')

    if (!community) {
      setPostError('Community is not loaded yet.')
      return
    }

    const trimmedContent = postContent.trim()

    if (!trimmedContent) {
      setPostError('Post cannot be empty.')
      return
    }

    setIsSubmittingPost(true)

    try {
      const newPost = await createPost(community.id, {
        content: trimmedContent,
      })

      setPosts((currentPosts) => [newPost, ...currentPosts])
      setCommentsByPostId((currentComments) => ({
        ...currentComments,
        [newPost.id]: [],
      }))
      setPostContent('')
    } catch {
      setPostError('Post could not be created. Please join the community and try again.')
    } finally {
      setIsSubmittingPost(false)
    }
  }

  const handleDeletePost = async (postId: number) => {
    const confirmed = window.confirm('Delete this post?')

    if (!confirmed) {
      return
    }

    try {
      await deletePost(postId)
      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId))
      setCommentsByPostId((currentComments) => {
        const updatedComments = { ...currentComments }
        delete updatedComments[postId]
        return updatedComments
      })
    } catch {
      setPostError('Post could not be deleted.')
    }
  }

  const handleToggleLike = async (post: Post) => {
    if (!currentUser) {
      setPostError('Please log in to like posts.')
      return
    }

    if (!community?.currentUserIsMember) {
      setPostError('Join this community to like posts.')
      return
    }

    try {
      const likeResponse = post.likedByCurrentUser
        ? await unlikePost(post.id)
        : await likePost(post.id)

      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id
            ? {
                ...currentPost,
                likeCount: likeResponse.likeCount,
                likedByCurrentUser: likeResponse.likedByCurrentUser,
              }
            : currentPost
        )
      )
    } catch {
      setPostError('Like action failed. Please try again.')
    }
  }

  const handleCommentInputChange = (postId: number, value: string) => {
    setCommentInputs((currentInputs) => ({
      ...currentInputs,
      [postId]: value,
    }))
  }

  const handleCreateComment = async (postId: number, event: { preventDefault: () => void }) => {
    event.preventDefault()
    setCommentError('')

    const content = (commentInputs[postId] || '').trim()

    if (!content) {
      setCommentError('Comment cannot be empty.')
      return
    }

    setIsSubmittingCommentPostId(postId)

    try {
      const newComment = await createComment(postId, { content })

      setCommentsByPostId((currentComments) => ({
        ...currentComments,
        [postId]: [...(currentComments[postId] || []), newComment],
      }))

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId ? { ...post, commentCount: post.commentCount + 1 } : post
        )
      )

      setCommentInputs((currentInputs) => ({
        ...currentInputs,
        [postId]: '',
      }))
    } catch {
      setCommentError('Comment could not be created.')
    } finally {
      setIsSubmittingCommentPostId(null)
    }
  }

  const handleDeleteComment = async (postId: number, commentId: number) => {
    const confirmed = window.confirm('Delete this comment?')

    if (!confirmed) {
      return
    }

    try {
      await deleteComment(commentId)

      setCommentsByPostId((currentComments) => ({
        ...currentComments,
        [postId]: (currentComments[postId] || []).filter((comment) => comment.id !== commentId),
      }))

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId ? { ...post, commentCount: Math.max(post.commentCount - 1, 0) } : post
        )
      )
    } catch {
      setCommentError('Comment could not be deleted.')
    }
  }

  function canDeletePost(post: Post) {
    if (!currentUser || !community) {
      return false
    }

    const isAuthor = post.author.id === currentUser.id
    const isCommunityOwner = community.owner.id === currentUser.id

    return isAuthor || isCommunityOwner
  }

  function canDeleteComment(comment: Comment) {
    if (!currentUser || !community) {
      return false
    }

    const isAuthor = comment.author.id === currentUser.id
    const isCommunityOwner = community.owner.id === currentUser.id

    return isAuthor || isCommunityOwner
  }

  const isLoggedIn = Boolean(currentUser)
  const isOwner = Boolean(currentUser && community && community.owner.id === currentUser.id)
  const isMember = Boolean(community?.currentUserIsMember)
  const canCreatePost = isLoggedIn && isMember

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading community...
      </main>
    )
  }

  if (error || !community) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <section className="mx-auto max-w-3xl">
          <Link className="text-sm text-slate-400 underline hover:text-white" to="/dashboard">
            ← Back to dashboard
          </Link>

          <div className="mt-8 rounded-2xl border border-red-800 bg-red-950 p-6 text-red-100">
            {error || 'Community not found.'}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex gap-4">
            <Link className="text-sm text-slate-400 underline hover:text-white" to="/dashboard">
              ← Dashboard
            </Link>

            <Link className="text-sm text-slate-400 underline hover:text-white" to="/communities">
              Browse communities
            </Link>
          </div>

          <span className="w-fit rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
            {community.visibility}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Community</p>

          <h1 className="mt-3 text-4xl font-bold">{community.name}</h1>

          <p className="mt-2 text-sm text-slate-400">/communities/{community.slug}</p>

          {community.description && (
            <p className="mt-6 max-w-3xl text-lg text-slate-300">{community.description}</p>
          )}

          <div className="mt-8 flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-400">Created by</p>
              <p className="mt-1 font-semibold">{community.owner.displayName}</p>
              <p className="text-sm text-slate-500">@{community.owner.username}</p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              {community.currentUserRole && (
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                  Your role: {community.currentUserRole}
                </span>
              )}

              {membershipError && <p className="text-sm text-red-300">{membershipError}</p>}

              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="rounded-lg bg-white px-5 py-3 text-center font-semibold text-slate-950 hover:bg-slate-200"
                >
                  Log in to join
                </Link>
              )}

              {isLoggedIn && !isMember && community.visibility === 'PUBLIC' && (
                <button
                  onClick={handleJoinCommunity}
                  className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isMembershipLoading}
                >
                  {isMembershipLoading ? 'Joining...' : 'Join Community'}
                </button>
              )}

              {isLoggedIn && isMember && !isOwner && (
                <button
                  onClick={handleLeaveCommunity}
                  className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isMembershipLoading}
                >
                  {isMembershipLoading ? 'Leaving...' : 'Leave Community'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Create Post</h2>

          {canCreatePost ? (
            <form onSubmit={handleCreatePost} className="mt-4">
              {postError && (
                <div className="mb-4 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
                  {postError}
                </div>
              )}

              <textarea
                className="min-h-32 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                value={postContent}
                onChange={(event) => setPostContent(event.target.value)}
                placeholder="Share something with the community..."
              />

              <button
                className="mt-4 rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSubmittingPost}
              >
                {isSubmittingPost ? 'Posting...' : 'Create Post'}
              </button>
            </form>
          ) : (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-slate-300">
                {isLoggedIn
                  ? 'Join this community to create posts.'
                  : 'Log in to create posts in this community.'}
              </p>

              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="mt-4 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
                >
                  Log in
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Community Feed</h2>

          {commentError && (
            <div className="mt-4 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
              {commentError}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <p className="text-slate-300">No posts yet.</p>
              <p className="mt-2 text-sm text-slate-500">Be the first to start a discussion.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4">
              {posts.map((post) => {
                const postComments = commentsByPostId[post.id] || []

                return (
                  <article
                    key={post.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <p className="font-semibold">{post.author.displayName}</p>
                        <p className="text-sm text-slate-500">@{post.author.username}</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleString()}
                        </span>

                        {canDeletePost(post) && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-xs font-semibold text-red-300 hover:text-red-200"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-slate-200">{post.content}</p>

                    <div className="mt-5 flex items-center gap-4 text-sm text-slate-500">
                      <button
                        onClick={() => handleToggleLike(post)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                          post.likedByCurrentUser
                            ? 'border-white bg-white text-slate-950'
                            : 'border-slate-700 text-slate-300 hover:bg-slate-900'
                        }`}
                        type="button"
                      >
                        {post.likedByCurrentUser ? 'Liked' : 'Like'} · {post.likeCount}
                      </button>

                      <span>{postComments.length} comments</span>
                    </div>

                    <div className="mt-5 border-t border-slate-800 pt-5">
                      <h3 className="text-sm font-semibold text-slate-300">Comments</h3>

                      {postComments.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-500">No comments yet.</p>
                      ) : (
                        <div className="mt-4 grid gap-3">
                          {postComments.map((comment) => (
                            <div
                              key={comment.id}
                              className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                            >
                              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                                <div>
                                  <p className="text-sm font-semibold">
                                    {comment.author.displayName}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    @{comment.author.username}
                                  </p>
                                </div>

                                <div className="flex items-start gap-3">
                                  <span className="text-xs text-slate-500">
                                    {new Date(comment.createdAt).toLocaleString()}
                                  </span>

                                  {canDeleteComment(comment) && (
                                    <button
                                      onClick={() => handleDeleteComment(post.id, comment.id)}
                                      className="text-xs font-semibold text-red-300 hover:text-red-200"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>

                              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {canCreatePost && (
                        <form
                          onSubmit={(event) => handleCreateComment(post.id, event)}
                          className="mt-4"
                        >
                          <textarea
                            className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white"
                            value={commentInputs[post.id] || ''}
                            onChange={(event) =>
                              handleCommentInputChange(post.id, event.target.value)
                            }
                            placeholder="Write a comment..."
                          />

                          <button
                            className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                            type="submit"
                            disabled={isSubmittingCommentPostId === post.id}
                          >
                            {isSubmittingCommentPostId === post.id
                              ? 'Commenting...'
                              : 'Add Comment'}
                          </button>
                        </form>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
