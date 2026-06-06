import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getPublicCommunities } from '../api/communityApi'
import type { Community } from '../types/community'

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCommunities() {
      try {
        const data = await getPublicCommunities()
        setCommunities(data)
      } catch {
        setError('Public communities could not be loaded.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCommunities()
  }, [])

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading communities...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Browse</p>
            <h1 className="mt-2 text-3xl font-bold">Public Communities</h1>
            <p className="mt-2 text-slate-300">
              Discover public communities and join conversations.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="rounded-lg border border-slate-700 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
          >
            Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {communities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
            <p className="text-slate-300">No public communities yet.</p>
            <Link
              to="/create-community"
              className="mt-4 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
            >
              Create the first community
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {communities.map((community) => (
              <Link
                key={community.id}
                to={`/communities/${community.slug}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:bg-slate-800"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <h2 className="text-xl font-semibold">{community.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">/communities/{community.slug}</p>

                    {community.description && (
                      <p className="mt-3 text-slate-300">{community.description}</p>
                    )}

                    <p className="mt-4 text-sm text-slate-500">
                      Created by {community.owner.displayName}
                    </p>
                  </div>

                  <span className="h-fit rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                    {community.visibility}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
