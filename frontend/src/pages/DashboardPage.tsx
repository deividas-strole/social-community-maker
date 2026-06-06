import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import type { User } from '../types/auth'
import type { Community } from '../types/community'
import { getCurrentUser } from '../api/authApi'
import { getMyCommunities } from '../api/communityApi'

export default function DashboardPage() {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null)
  const [communities, setCommunities] = useState<Community[]>([])
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
        setCommunities(myCommunities)
      } catch (err) {
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

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading dashboard...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">
              Welcome{user ? `, ${user.displayName}` : ''}
            </h1>
            <p className="mt-2 text-slate-300">Manage your communities, posts, and account.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/create-community"
              className="rounded-lg bg-white px-5 py-3 text-center font-semibold text-slate-950 hover:bg-slate-200"
            >
              Create Community
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Owned Communities</h2>
            <p className="mt-3 text-3xl font-bold">{communities.length}</p>
            <p className="mt-2 text-sm text-slate-400">Communities you created.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Joined Communities</h2>
            <p className="mt-3 text-3xl font-bold">0</p>
            <p className="mt-2 text-sm text-slate-400">Membership features coming soon.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Posts</h2>
            <p className="mt-3 text-3xl font-bold">0</p>
            <p className="mt-2 text-sm text-slate-400">Posting features coming soon.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Your Communities</h2>
              <p className="mt-1 text-sm text-slate-400">Communities you have created.</p>
            </div>

            <Link
              to="/create-community"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              New
            </Link>
          </div>

          {communities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <p className="text-slate-300">No communities yet.</p>
              <Link
                to="/create-community"
                className="mt-4 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
              >
                Create your first community
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {communities.map((community) => (
                <div
                  key={community.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <h3 className="text-lg font-semibold">{community.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">/communities/{community.slug}</p>
                      {community.description && (
                        <p className="mt-3 text-slate-300">{community.description}</p>
                      )}
                    </div>

                    <span className="h-fit rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                      {community.visibility}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
