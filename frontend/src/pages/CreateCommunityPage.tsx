import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { createCommunity } from '../api/communityApi'
import type { CommunityVisibility } from '../types/community'

export default function CreateCommunityPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<CommunityVisibility>('PUBLIC')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  function handleNameChange(value: string) {
    setName(value)

    if (!slug) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const community = await createCommunity({
        name,
        slug,
        description,
        visibility,
      })

      navigate(`/communities/${community.slug}`)
    } catch {
      setError('Community could not be created. Please check the slug and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-73px)] px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">New Community</p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight">Create a community</h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Launch a public or private space where members can post, comment, like content, and
                participate in discussions.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-700 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
          >
            {error && (
              <div className="mb-5 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Community name
              </label>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                type="text"
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="LA Developers"
                required
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-200">Slug</label>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                type="text"
                value={slug}
                onChange={(event) => setSlug(generateSlug(event.target.value))}
                placeholder="la-developers"
                required
              />
              <p className="mt-2 text-sm text-slate-400">
                URL preview:{' '}
                <span className="font-mono text-slate-300">
                  /communities/{slug || 'your-community'}
                </span>
              </p>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-200">Description</label>
              <textarea
                className="min-h-36 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the purpose of this community..."
              />
              <p className="mt-2 text-sm text-slate-500">
                Keep it short and clear. You can expand this later.
              </p>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-200">Visibility</label>
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                value={visibility}
                onChange={(event) => setVisibility(event.target.value as CommunityVisibility)}
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
                <option value="INVITE_ONLY">Invite only</option>
              </select>
            </div>

            <button
              className="w-full rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating community...' : 'Create community'}
            </button>
          </form>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Community setup tips</h2>

            <div className="mt-5 grid gap-4 text-sm text-slate-400">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-semibold text-slate-200">Use a clean slug</p>
                <p className="mt-2">
                  Slugs should be lowercase, readable, and URL-friendly, such as
                  <span className="font-mono text-slate-300"> la-developers</span>.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-semibold text-slate-200">Start public</p>
                <p className="mt-2">
                  Public communities are easier to discover and test during the MVP stage.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-semibold text-slate-200">Write a clear purpose</p>
                <p className="mt-2">
                  A short description helps users understand why they should join.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
