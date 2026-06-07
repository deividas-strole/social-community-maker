import { Link, Outlet, useNavigate } from 'react-router'

export default function AppLayout() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight">
            Social Community Maker
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link className="text-slate-300 hover:text-white" to="/communities">
              Browse
            </Link>

            {token ? (
              <>
                <Link className="text-slate-300 hover:text-white" to="/dashboard">
                  Dashboard
                </Link>

                <Link
                  className="rounded-lg border border-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-800"
                  to="/create-community"
                >
                  Create Community
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-800"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link className="text-slate-300 hover:text-white" to="/login">
                  Log in
                </Link>

                <Link
                  className="rounded-lg bg-white px-4 py-2 font-semibold text-slate-950 hover:bg-slate-200"
                  to="/register"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <Outlet />
    </div>
  )
}
