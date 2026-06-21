import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getCommunityBySlug, joinCommunity, leaveCommunity } from '../api/communityApi'
import {
  createPost,
  deletePost,
  getCommunityPosts,
  likePost,
  unlikePost,
  uploadPostImage,
  updatePost,
} from '../api/postApi'
import { createComment, deleteComment, getPostComments, updateComment } from '../api/commentApi'
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

  const [currentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      return null
    }

    try {
      return JSON.parse(storedUser) as User
    } catch {
      return null
    }
  })

  const [postContent, setPostContent] = useState('')
  const [selectedPostImageFile, setSelectedPostImageFile] = useState<File | null>(null)
  const [postImagePreviewUrl, setPostImagePreviewUrl] = useState('')

  const [error, setError] = useState('')
  const [postError, setPostError] = useState('')
  const [commentError, setCommentError] = useState('')
  const [membershipError, setMembershipError] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)
  const [isSubmittingCommentPostId, setIsSubmittingCommentPostId] = useState<number | null>(null)
  const [isMembershipLoading, setIsMembershipLoading] = useState(false)

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reloadCommunityAndPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  function handlePostImageFileChange(file: File | null) {
    setSelectedPostImageFile(file)

    if (!file) {
      setPostImagePreviewUrl('')
      return
    }

    setPostImagePreviewUrl(URL.createObjectURL(file))
  }

  function clearSelectedPostImage() {
    setSelectedPostImageFile(null)
    setPostImagePreviewUrl('')
  }

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
      let imageUrl = ''

      if (selectedPostImageFile) {
        const uploadResponse = await uploadPostImage(selectedPostImageFile)
        imageUrl = uploadResponse.imageUrl
      }

      const newPost = await createPost(community.id, {
        content: trimmedContent,
        imageUrl,
      })

      setPosts((currentPosts) => [newPost, ...currentPosts])
      setCommentsByPostId((currentComments) => ({
        ...currentComments,
        [newPost.id]: [],
      }))
      setPostContent('')
      clearSelectedPostImage()
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
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5 text-slate-300">
          Loading community...
        </div>
      </main>
    )
  }

  if (error || !community) {
    return (
      <main className="min-h-[calc(100vh-73px)] px-6 py-10">
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
    <main className="min-h-[calc(100vh-73px)] px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <PageLinks />

        <CommunityHeader
          community={community}
          isLoggedIn={isLoggedIn}
          isMember={isMember}
          isOwner={isOwner}
          membershipError={membershipError}
          isMembershipLoading={isMembershipLoading}
          onJoin={handleJoinCommunity}
          onLeave={handleLeaveCommunity}
        />

        <CreatePostPanel
          canCreatePost={canCreatePost}
          isLoggedIn={isLoggedIn}
          postContent={postContent}
          postError={postError}
          isSubmittingPost={isSubmittingPost}
          postImagePreviewUrl={postImagePreviewUrl}
          onPostContentChange={setPostContent}
          onPostImageFileChange={handlePostImageFileChange}
          onClearPostImage={clearSelectedPostImage}
          onCreatePost={handleCreatePost}
        />

        <FeedPanel
          posts={posts}
          commentsByPostId={commentsByPostId}
          commentInputs={commentInputs}
          commentError={commentError}
          canCreatePost={canCreatePost}
          isSubmittingCommentPostId={isSubmittingCommentPostId}
          canDeletePost={canDeletePost}
          canDeleteComment={canDeleteComment}
          onToggleLike={handleToggleLike}
          onDeletePost={handleDeletePost}
          onCommentInputChange={handleCommentInputChange}
          onCreateComment={handleCreateComment}
          onDeleteComment={handleDeleteComment}
        />
      </section>
    </main>
  )
}

function PageLinks() {
  return (
    <div className="mb-8 flex flex-wrap gap-4">
      <Link className="text-sm text-slate-400 underline hover:text-white" to="/dashboard">
        ← Dashboard
      </Link>

      <Link className="text-sm text-slate-400 underline hover:text-white" to="/communities">
        Browse communities
      </Link>
    </div>
  )
}

type CommunityHeaderProps = {
  community: Community
  isLoggedIn: boolean
  isMember: boolean
  isOwner: boolean
  membershipError: string
  isMembershipLoading: boolean
  onJoin: () => void
  onLeave: () => void
}

function CommunityHeader({
  community,
  isLoggedIn,
  isMember,
  isOwner,
  membershipError,
  isMembershipLoading,
  onJoin,
  onLeave,
}: CommunityHeaderProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Community</p>

            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
              {community.visibility}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight">{community.name}</h1>

          <p className="mt-2 font-mono text-sm text-slate-500">/communities/{community.slug}</p>

          {community.description && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {community.description}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 lg:min-w-72">
          <p className="text-sm text-slate-400">Created by</p>

          <Link
            to={`/users/${community.owner.username}`}
            className="mt-1 block font-semibold hover:text-white hover:underline"
          >
            {community.owner.displayName}
          </Link>

          <Link
            to={`/users/${community.owner.username}`}
            className="text-sm text-slate-500 hover:text-slate-300 hover:underline"
          >
            @{community.owner.username}
          </Link>

          <div className="mt-5 border-t border-slate-800 pt-5">
            {community.currentUserRole ? (
              <span className="inline-block rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                Your role: {community.currentUserRole}
              </span>
            ) : (
              <p className="text-sm text-slate-500">You are not a member yet.</p>
            )}

            {membershipError && <p className="mt-3 text-sm text-red-300">{membershipError}</p>}

            <div className="mt-4">
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="block rounded-lg bg-white px-5 py-3 text-center font-semibold text-slate-950 hover:bg-slate-200"
                >
                  Log in to join
                </Link>
              )}

              {isLoggedIn && !isMember && community.visibility === 'PUBLIC' && (
                <button
                  onClick={onJoin}
                  className="w-full rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isMembershipLoading}
                >
                  {isMembershipLoading ? 'Joining...' : 'Join Community'}
                </button>
              )}

              {isLoggedIn && isMember && !isOwner && (
                <button
                  onClick={onLeave}
                  className="w-full rounded-lg border border-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isMembershipLoading}
                >
                  {isMembershipLoading ? 'Leaving...' : 'Leave Community'}
                </button>
              )}

              {isLoggedIn && isOwner && (
                <p className="text-sm text-slate-400">You own this community.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type CreatePostPanelProps = {
  canCreatePost: boolean
  isLoggedIn: boolean
  postContent: string
  postError: string
  isSubmittingPost: boolean
  postImagePreviewUrl: string
  onPostContentChange: (value: string) => void
  onPostImageFileChange: (file: File | null) => void
  onClearPostImage: () => void
  onCreatePost: (event: { preventDefault: () => void }) => void
}

function CreatePostPanel({
  canCreatePost,
  isLoggedIn,
  postContent,
  postError,
  isSubmittingPost,
  postImagePreviewUrl,
  onPostContentChange,
  onPostImageFileChange,
  onClearPostImage,
  onCreatePost,
}: CreatePostPanelProps) {
  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">Start a discussion</h2>
      <p className="mt-1 text-sm text-slate-400">
        Share an update, question, or idea with this community.
      </p>

      {canCreatePost ? (
        <form onSubmit={onCreatePost} className="mt-5">
          {postError && (
            <div className="mb-4 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
              {postError}
            </div>
          )}

          <textarea
            className="min-h-32 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
            value={postContent}
            onChange={(event) => onPostContentChange(event.target.value)}
            placeholder="Share something with the community..."
          />

          <div className="mt-4">
            <label className="block text-sm font-semibold text-slate-300" htmlFor="postImage">
              Add image
            </label>

            <input
              id="postImage"
              type="file"
              accept="image/*"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-slate-200"
              onChange={(event) => onPostImageFileChange(event.target.files?.[0] || null)}
            />

            <p className="mt-2 text-xs text-slate-500">Optional. Maximum image size: 2MB.</p>

            {postImagePreviewUrl && (
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <img
                  src={postImagePreviewUrl}
                  alt="Post preview"
                  className="max-h-80 w-full rounded-lg object-cover"
                />

                <button
                  type="button"
                  onClick={onClearPostImage}
                  className="mt-3 text-sm font-semibold text-red-300 hover:text-red-200"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <button
            className="mt-4 rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmittingPost}
          >
            {isSubmittingPost ? 'Posting...' : 'Create Post'}
          </button>
        </form>
      ) : (
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-slate-300">
            {isLoggedIn
              ? 'Join this community to create posts, comments, and likes.'
              : 'Log in to participate in this community.'}
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
  )
}

type FeedPanelProps = {
  posts: Post[]
  commentsByPostId: Record<number, Comment[]>
  commentInputs: Record<number, string>
  commentError: string
  canCreatePost: boolean
  isSubmittingCommentPostId: number | null
  canDeletePost: (post: Post) => boolean
  canDeleteComment: (comment: Comment) => boolean
  onToggleLike: (post: Post) => void
  onDeletePost: (postId: number) => void
  onCommentInputChange: (postId: number, value: string) => void
  onCreateComment: (postId: number, event: { preventDefault: () => void }) => void
  onDeleteComment: (postId: number, commentId: number) => void
}

function FeedPanel({
  posts,
  commentsByPostId,
  commentInputs,
  commentError,
  canCreatePost,
  isSubmittingCommentPostId,
  canDeletePost,
  canDeleteComment,
  onToggleLike,
  onDeletePost,
  onCommentInputChange,
  onCreateComment,
  onDeleteComment,
}: FeedPanelProps) {
  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">Posts</h2>
      <p className="mt-1 text-sm text-slate-400">Follow discussions from this community.</p>

      {commentError && (
        <div className="mt-4 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
          {commentError}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
          <p className="text-slate-300">No posts yet.</p>
          <p className="mt-2 text-sm text-slate-500">
            Members can start the first discussion in this community.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              comments={commentsByPostId[post.id] || []}
              commentInput={commentInputs[post.id] || ''}
              canCreatePost={canCreatePost}
              isSubmittingComment={isSubmittingCommentPostId === post.id}
              canDeletePost={canDeletePost(post)}
              canDeleteComment={canDeleteComment}
              onToggleLike={() => onToggleLike(post)}
              onDeletePost={() => onDeletePost(post.id)}
              onCommentInputChange={(value) => onCommentInputChange(post.id, value)}
              onCreateComment={(event) => onCreateComment(post.id, event)}
              onDeleteComment={(commentId) => onDeleteComment(post.id, commentId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

type PostCardProps = {
  post: Post
  comments: Comment[]
  commentInput: string
  canCreatePost: boolean
  isSubmittingComment: boolean
  canDeletePost: boolean
  canDeleteComment: (comment: Comment) => boolean
  onToggleLike: () => void
  onDeletePost: () => void
  onCommentInputChange: (value: string) => void
  onCreateComment: (event: { preventDefault: () => void }) => void
  onDeleteComment: (commentId: number) => void
}

function PostCard({
  post,
  comments,
  commentInput,
  canCreatePost,
  isSubmittingComment,
  canDeletePost,
  canDeleteComment,
  onToggleLike,
  onDeletePost,
  onCommentInputChange,
  onCreateComment,
  onDeleteComment,
}: PostCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div>
          <Link
            to={`/users/${post.author.username}`}
            className="font-semibold hover:text-white hover:underline"
          >
            {post.author.displayName}
          </Link>

          <Link
            to={`/users/${post.author.username}`}
            className="block text-sm text-slate-500 hover:text-slate-300 hover:underline"
          >
            @{post.author.username}
          </Link>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-xs text-slate-500">
            {new Date(post.createdAt).toLocaleString()}
          </span>

          {canDeletePost && (
            <button
              onClick={onDeletePost}
              className="text-xs font-semibold text-red-300 hover:text-red-200"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-slate-200">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post attachment"
          className="mt-5 max-h-[500px] w-full rounded-xl border border-slate-800 object-cover"
        />
      )}

      <div className="mt-5 flex items-center gap-4 text-sm text-slate-500">
        <button
          onClick={onToggleLike}
          className={`rounded-full border px-4 py-2 text-sm font-semibold ${
            post.likedByCurrentUser
              ? 'border-white bg-white text-slate-950'
              : 'border-slate-700 text-slate-300 hover:bg-slate-900'
          }`}
          type="button"
        >
          {post.likedByCurrentUser ? 'Liked' : 'Like'} · {post.likeCount}
        </button>

        <span>{comments.length} comments</span>
      </div>

      <CommentSection
        comments={comments}
        commentInput={commentInput}
        canCreatePost={canCreatePost}
        isSubmittingComment={isSubmittingComment}
        canDeleteComment={canDeleteComment}
        onCommentInputChange={onCommentInputChange}
        onCreateComment={onCreateComment}
        onDeleteComment={onDeleteComment}
      />
    </article>
  )
}

type CommentSectionProps = {
  comments: Comment[]
  commentInput: string
  canCreatePost: boolean
  isSubmittingComment: boolean
  canDeleteComment: (comment: Comment) => boolean
  onCommentInputChange: (value: string) => void
  onCreateComment: (event: { preventDefault: () => void }) => void
  onDeleteComment: (commentId: number) => void
}

function CommentSection({
  comments,
  commentInput,
  canCreatePost,
  isSubmittingComment,
  canDeleteComment,
  onCommentInputChange,
  onCreateComment,
  onDeleteComment,
}: CommentSectionProps) {
  return (
    <div className="mt-5 border-t border-slate-800 pt-5">
      <h3 className="text-sm font-semibold text-slate-300">Comments</h3>

      {comments.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No comments yet.</p>
      ) : (
        <div className="mt-4 grid gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <div>
                  <Link
                    to={`/users/${comment.author.username}`}
                    className="text-sm font-semibold hover:text-white hover:underline"
                  >
                    {comment.author.displayName}
                  </Link>

                  <Link
                    to={`/users/${comment.author.username}`}
                    className="block text-xs text-slate-500 hover:text-slate-300 hover:underline"
                  >
                    @{comment.author.username}
                  </Link>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xs text-slate-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>

                  {canDeleteComment(comment) && (
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="text-xs font-semibold text-red-300 hover:text-red-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {canCreatePost && (
        <form onSubmit={onCreateComment} className="mt-4">
          <textarea
            className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-white"
            value={commentInput}
            onChange={(event) => onCommentInputChange(event.target.value)}
            placeholder="Write a comment..."
          />

          <button
            className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmittingComment}
          >
            {isSubmittingComment ? 'Commenting...' : 'Add Comment'}
          </button>
        </form>
      )}
    </div>
  )
}
