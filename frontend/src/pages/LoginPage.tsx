import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { loginUser } from '../api/authApi'

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await loginUser({
        email,
        password,
      })

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      navigate('/dashboard')
    } catch (err) {
      setError('Login failed. Please check your email and password.')
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

          <h1 className="text-3xl font-bold">Log in</h1>

          <p className="mt-3 text-slate-300">Access your communities and dashboard.</p>
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

          <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
          <input
            className="mb-6 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button
            className="w-full rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-400">
            Do not have an account?{' '}
            <Link className="font-medium text-white underline" to="/register">
              Create one
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}
