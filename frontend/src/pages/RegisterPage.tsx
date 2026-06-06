import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { registerUser } from '../api/authApi'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await registerUser({
        email,
        username,
        displayName,
        password,
      })

      navigate('/login')
    } catch (err) {
      setError('Registration failed. Please check your information and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Social Community Maker
          </p>

          <h1 className="text-3xl font-bold">Create your account</h1>

          <p className="mt-3 text-slate-300">Start building and joining online communities.</p>
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

          <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
          <input
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className="mb-2 block text-sm font-medium text-slate-200">Username</label>
          <input
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label className="mb-2 block text-sm font-medium text-slate-200">Display name</label>
          <input
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
          />

          <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
          <input
            className="mb-6 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />

          <button
            className="w-full rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link className="font-medium text-white underline" to="/login">
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}
