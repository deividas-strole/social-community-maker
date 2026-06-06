import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import type { User } from '../types/auth'
import { getCurrentUser } from '../api/authApi'

export default function DashboardPage() {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const currentUser = await getCurrentUser(token)
        setUser(currentUser)
      } catch (err) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setError('Session expired. Please log in again.')
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
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

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-800"
          >
            Log out
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Owned Communities</h2>
            <p className="mt-3 text-3xl font-bold">0</p>
            <p className="mt-2 text-sm text-slate-400">Community creation coming next.</p>
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
      </section>
    </main>
  )
}
