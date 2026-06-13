import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getUserProfile } from './profileApi'
import type { UserProfile } from './profileTypes'

function UserProfilePage() {
  const { username } = useParams<{ username: string }>()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [currentUsername, setCurrentUsername] = useState<string | null>(null)
  const [avatarFailed, setAvatarFailed] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      setCurrentUsername(null)
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser) as { username?: string }
      setCurrentUsername(parsedUser.username || null)
    } catch {
      setCurrentUsername(null)
    }
  }, [])

  useEffect(() => {
    async function loadProfile() {
      if (!username) {
        setErrorMessage('Username is missing.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setErrorMessage('')

        const data = await getUserProfile(username)
        setProfile(data)
        setAvatarFailed(false)
      } catch (error) {
        console.error(error)
        setErrorMessage('User profile could not be loaded.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [username])

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5 text-slate-300">
          Loading profile...
        </div>
      </main>
    )
  }

  if (errorMessage || !profile) {
    return (
      <main className="min-h-[calc(100vh-73px)] px-6 py-10">
        <section className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center shadow-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Profile</p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">Profile not found</h1>

            <p className="mx-auto mt-3 max-w-xl text-slate-400">{errorMessage}</p>

            <Link
              to="/communities"
              className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
            >
              Browse Communities
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const isOwnProfile = currentUsername === profile.username

  return (
    <main className="min-h-[calc(100vh-73px)] px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {profile.avatarUrl && !avatarFailed ? (
                <img
                  src={profile.avatarUrl}
                  alt={`${profile.displayName} avatar`}
                  className="h-24 w-24 shrink-0 rounded-full border border-slate-700 object-cover"
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-4xl font-bold text-slate-200">
                  {profile.displayName?.charAt(0)?.toUpperCase() ||
                    profile.username.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">User Profile</p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight">{profile.displayName}</h1>

                <p className="mt-2 text-slate-400">@{profile.username}</p>

                <p className="mt-2 text-sm text-slate-500">
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:min-w-[360px]">
              <div className="grid gap-4 sm:grid-cols-3">
                <ProfileStat label="Owned" value={profile.ownedCommunities.length} />
                <ProfileStat label="Joined" value={profile.joinedCommunities.length} />
                <ProfileStat label="Posts" value={profile.recentPosts.length} />
              </div>

              {isOwnProfile && (
                <Link
                  to="/edit-profile"
                  className="rounded-lg bg-white px-5 py-3 text-center font-semibold text-slate-950 hover:bg-slate-200"
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bio</p>

            <p className="mt-3 leading-7 text-slate-300">
              {profile.bio || 'This user has not added a bio yet.'}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <ProfileCommunitySection
            title="Owned Communities"
            description="Communities created and managed by this user."
            communities={profile.ownedCommunities}
            emptyMessage="No owned communities yet."
            badgeFallback="OWNER"
          />

          <ProfileCommunitySection
            title="Joined Communities"
            description="Communities where this user participates as a member."
            communities={profile.joinedCommunities}
            emptyMessage="No joined communities yet."
            badgeFallback="MEMBER"
          />
        </div>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Recent Posts</h2>
            <p className="mt-1 text-sm text-slate-400">Latest posts created by this user.</p>
          </div>

          {profile.recentPosts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
              <p className="font-semibold text-slate-200">No recent posts yet.</p>
              <p className="mt-2 text-sm text-slate-500">This user has not posted anything yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {profile.recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <Link
                    to={`/communities/${post.communitySlug}`}
                    className="text-sm font-semibold text-slate-200 hover:underline"
                  >
                    {post.communityName}
                  </Link>

                  <p className="mt-4 leading-7 text-slate-300">{post.content}</p>

                  <p className="mt-4 border-t border-slate-800 pt-4 text-xs text-slate-500">
                    Posted {new Date(post.createdAt).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

type ProfileStatProps = {
  label: string
  value: number
}

function ProfileStat({ label, value }: ProfileStatProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
      <p className="text-3xl font-bold text-slate-100">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}

type ProfileCommunity = UserProfile['ownedCommunities'][number]

type ProfileCommunitySectionProps = {
  title: string
  description: string
  communities: ProfileCommunity[]
  emptyMessage: string
  badgeFallback: string
}

function ProfileCommunitySection({
  title,
  description,
  communities,
  emptyMessage,
  badgeFallback,
}: ProfileCommunitySectionProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>

      {communities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
          <p className="font-semibold text-slate-200">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {communities.map((community) => (
            <Link
              key={community.id}
              to={`/communities/${community.slug}`}
              className="rounded-xl border border-slate-800 bg-slate-950 p-5 hover:bg-slate-900"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <h3 className="text-lg font-semibold">{community.name}</h3>

                  <p className="mt-1 text-sm text-slate-500">/communities/{community.slug}</p>

                  {community.description ? (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">
                      {community.description}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm italic text-slate-500">No description provided.</p>
                  )}
                </div>

                <span className="h-fit w-fit rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                  {community.visibility || badgeFallback}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default UserProfilePage
