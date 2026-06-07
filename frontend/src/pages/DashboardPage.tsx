import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import type { User } from '../types/auth'
import type { Community } from '../types/community'
import { getCurrentUser } from '../api/authApi'
import { getMyCommunities } from '../api/communityApi'

export default function DashboardPage() {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null)
  const [ownedCommunities, setOwnedCommunities] = useState<Community[]>([])
  const [joinedCommunities, setJoinedCommunities] = useState<Community[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const [currentUser, myCommunities] = await Promise.all([
          getCurrentUser(token),
          getMyCommunities(),
        ])

        setUser(currentUser)
        setOwnedCommunities(myCommunities.ownedCommunities)
        setJoinedCommunities(myCommunities.joinedCommunities)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setError('Session expired. Please log in again.')
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [navigate])

  const totalCommunities = ownedCommunities.length + joinedCommunities.length

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5 text-slate-300">
          Loading dashboard...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-73px)] px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Dashboard</p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight">
                Welcome{user ? `, ${user.displayName}` : ''}
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Manage your communities, browse public communities, and continue building your
                social platform.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/create-community"
                className="rounded-lg bg-white px-5 py-3 text-center font-semibold text-slate-950 hover:bg-slate-200"
              >
                Create Community
              </Link>

              <Link
                to="/communities"
                className="rounded-lg border border-slate-700 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
              >
                Browse Communities
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Owned Communities</p>
            <p className="mt-3 text-4xl font-bold">{ownedCommunities.length}</p>
            <p className="mt-2 text-sm text-slate-500">Communities you created.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Joined Communities</p>
            <p className="mt-3 text-4xl font-bold">{joinedCommunities.length}</p>
            <p className="mt-2 text-sm text-slate-500">Communities you joined.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total Communities</p>
            <p className="mt-3 text-4xl font-bold">{totalCommunities}</p>
            <p className="mt-2 text-sm text-slate-500">Your current community activity.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <CommunitySection
            title="Owned Communities"
            description="Communities you created and manage."
            communities={ownedCommunities}
            emptyTitle="No owned communities yet."
            emptyDescription="Create your first community and start building your platform."
            emptyActionLabel="Create Community"
            emptyActionTo="/create-community"
            badgeFallback="OWNER"
          />

          <CommunitySection
            title="Joined Communities"
            description="Communities where you participate as a member."
            communities={joinedCommunities}
            emptyTitle="No joined communities yet."
            emptyDescription="Browse public communities and join one."
            emptyActionLabel="Browse Communities"
            emptyActionTo="/communities"
            badgeFallback="MEMBER"
          />
        </div>
      </section>
    </main>
  )
}

type CommunitySectionProps = {
  title: string
  description: string
  communities: Community[]
  emptyTitle: string
  emptyDescription: string
  emptyActionLabel: string
  emptyActionTo: string
  badgeFallback: string
}

function CommunitySection({
  title,
  description,
  communities,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionTo,
  badgeFallback,
}: CommunitySectionProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>

      {communities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
          <p className="font-semibold text-slate-200">{emptyTitle}</p>
          <p className="mt-2 text-sm text-slate-500">{emptyDescription}</p>

          <Link
            to={emptyActionTo}
            className="mt-5 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
          >
            {emptyActionLabel}
          </Link>
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

                  {community.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-300">
                      {community.description}
                    </p>
                  )}
                </div>

                <span className="h-fit w-fit rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                  {community.currentUserRole || badgeFallback}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
