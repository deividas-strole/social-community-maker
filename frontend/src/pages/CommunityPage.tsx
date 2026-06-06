import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getCommunityBySlug } from '../api/communityApi'
import type { Community } from '../types/community'

export default function CommunityPage() {
  const { slug } = useParams<{ slug: string }>()

  const [community, setCommunity] = useState<Community | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCommunity() {
      if (!slug) {
        setError('Community slug is missing.')
        setIsLoading(false)
        return
      }

      try {
        const data = await getCommunityBySlug(slug)
        setCommunity(data)
      } catch (err) {
        setError('Community could not be found.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCommunity()
  }, [slug])

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
          <Link className="text-sm text-slate-400 underline hover:text-white" to="/dashboard">
            ← Back to dashboard
          </Link>

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

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm text-slate-400">Created by</p>
            <p className="mt-1 font-semibold">{community.owner.displayName}</p>
            <p className="text-sm text-slate-500">@{community.owner.username}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Community Feed</h2>
          <p className="mt-2 text-slate-400">
            Posts feature coming next. This page is ready for the future community feed.
          </p>
        </div>
      </section>
    </main>
  )
}
