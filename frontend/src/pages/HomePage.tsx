export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
          Social Community Maker
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Create and manage your own online community.
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-slate-300">
          A full-stack SaaS-style platform for launching custom social communities with members,
          posts, comments, likes, and moderation tools.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="#"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-slate-200"
          >
            Get Started
          </a>

          <a
            href="#"
            className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-900"
          >
            View Communities
          </a>
        </div>
      </section>
    </main>
  )
}
