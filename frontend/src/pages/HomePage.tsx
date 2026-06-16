import { Link } from 'react-router'

export default function HomePage() {
  // const features = [
  //   {
  //     title: 'Create communities',
  //     description:
  //       'Launch public communities with custom names, slugs, descriptions, and visibility settings.',
  //   },
  //   {
  //     title: 'Member participation',
  //     description:
  //       'Users can join communities, create posts, comment, like posts, and participate in feeds.',
  //   },
  //   {
  //     title: 'Full-stack architecture',
  //     description:
  //       'Built with React, TypeScript, Spring Boot, JWT authentication, JPA, and H2/PostgreSQL-ready persistence.',
  //   },
  // ]

  return (
    <div className="bg-[url('/DSC_0152.JPG')] bg-cover bg-center bg-no-repeat w-screen h-screen">
      <main className="min-h-[calc(100vh-73px)] px-6">
        <section className="mx-auto flex max-w-6xl flex-col items-center justify-center py-20 text-center lg:py-28">
          {/*<p className="mb-5 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300">*/}
          {/*  Full-stack React + Spring Boot social platform*/}
          {/*</p>*/}

          <h1 className="text-red-400 [-webkit-text-stroke:1px_black] max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Build, join, and grow online communities.
          </h1>

          {/*<p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">*/}
          {/*  Social Community Maker is a social platform where users can create communities, join*/}
          {/*  public groups, publish posts, comment, like content, and manage their dashboard.*/}
          {/*</p>*/}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-slate-200"
            >
              Get Started
            </Link>

            <Link
              to="/communities"
              className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-900"
            >
              Browse Communities
            </Link>
          </div>
        </section>

        {/*<section className="mx-auto grid max-w-6xl gap-6 pb-20 md:grid-cols-3">*/}
        {/*  {features.map((feature) => (*/}
        {/*    <div key={feature.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">*/}
        {/*      <h2 className="text-xl font-semibold">{feature.title}</h2>*/}
        {/*      <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</section>*/}

        {/*<section className="mx-auto max-w-6xl pb-20">*/}
        {/*  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">*/}
        {/*    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">MVP Features</p>*/}

        {/*    <div className="mt-6 grid gap-4 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4">*/}
        {/*      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">*/}
        {/*        JWT Authentication*/}
        {/*      </div>*/}
        {/*      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">*/}
        {/*        Community Membership*/}
        {/*      </div>*/}
        {/*      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">*/}
        {/*        Posts & Comments*/}
        {/*      </div>*/}
        {/*      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">*/}
        {/*        Likes & Dashboard*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</section>*/}
      </main>
    </div>
  )
}
