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
      await createCommunity({
        name,
        slug,
        description,
        visibility,
      })

      navigate('/dashboard')
    } catch (err) {
      setError('Community could not be created. Please check the slug and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link className="text-sm text-slate-400 underline hover:text-white" to="/dashboard">
            ← Back to dashboard
          </Link>

          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-slate-400">
            Social Community Maker
          </p>

          <h1 className="mt-3 text-3xl font-bold">Create a community</h1>

          <p className="mt-3 text-slate-300">
            Launch a new online space for members, posts, discussions, and future moderation tools.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <label className="mb-2 block text-sm font-medium text-slate-200">Community name</label>
          <input
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
            type="text"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="LA Developers"
            required
          />

          <label className="mb-2 block text-sm font-medium text-slate-200">Slug</label>
          <input
            className="mb-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
            type="text"
            value={slug}
            onChange={(event) => setSlug(generateSlug(event.target.value))}
            placeholder="la-developers"
            required
          />
          <p className="mb-4 text-sm text-slate-400">
            URL preview: /communities/{slug || 'your-community'}
          </p>

          <label className="mb-2 block text-sm font-medium text-slate-200">Description</label>
          <textarea
            className="mb-4 min-h-32 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the purpose of this community..."
          />

          <label className="mb-2 block text-sm font-medium text-slate-200">Visibility</label>
          <select
            className="mb-6 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as CommunityVisibility)}
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="INVITE_ONLY">Invite only</option>
          </select>

          <button
            className="w-full rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating community...' : 'Create community'}
          </button>
        </form>
      </section>
    </main>
  )
}
