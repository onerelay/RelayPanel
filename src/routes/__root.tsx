// src/routes/__root.tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { SpeedInsights } from '@vercel/speed-insights/react'

import Header from '../components/Header'
import { Footer } from '../components/Footer'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Relay Panel',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: function NotFound() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
          <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Take me home
          </Link>
        </div>
      </div>
    )
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-y-scroll">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Layout dengan flex column agar footer selalu di bawah */}
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        <Scripts />
        <SpeedInsights />
      </body>
    </html>
  )
}