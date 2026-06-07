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
        setError('Public communities could not be loaded. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCommunities()
  }, [])

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5 text-slate-300">
          Loading communities...
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
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Discover</p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight">Browse public communities</h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Explore communities created by users, join public groups, and participate in posts,
                comments, and discussions.
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
                to="/dashboard"
                className="rounded-lg border border-slate-700 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Public communities</h2>
            <p className="mt-1 text-sm text-slate-400">
              {communities.length} {communities.length === 1 ? 'community' : 'communities'}{' '}
              available
            </p>
          </div>
        </div>

        {communities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
            <p className="text-xl font-semibold text-slate-200">No public communities yet.</p>

            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Be the first to create a public community and start building a space for members,
              posts, comments, and likes.
            </p>

            <Link
              to="/create-community"
              className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200"
            >
              Create the first community
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {communities.map((community) => (
              <article
                key={community.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-semibold">{community.name}</h3>

                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                        {community.visibility}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">/communities/{community.slug}</p>
                  </div>
                </div>

                {community.description ? (
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-300">
                    {community.description}
                  </p>
                ) : (
                  <p className="mt-5 text-sm italic text-slate-500">No description provided.</p>
                )}

                <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-800 pt-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Created by</p>
                    <p className="mt-1 text-sm font-semibold text-slate-300">
                      {community.owner.displayName}
                    </p>
                    <p className="text-xs text-slate-500">@{community.owner.username}</p>
                  </div>

                  <Link
                    to={`/communities/${community.slug}`}
                    className="rounded-lg bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-slate-200"
                  >
                    View Community
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
