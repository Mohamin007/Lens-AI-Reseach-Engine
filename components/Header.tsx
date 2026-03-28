'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'About', href: '/#about' },
] as const

export function Header() {
  const pathname = usePathname()

  const scrollToSearch = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === '/') {
      document.getElementById('search')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      window.location.assign('/#search')
    }
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black">
      <div className="flex h-14 w-full items-center justify-between px-4 sm:h-16 sm:px-8">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-white transition-colors hover:text-zinc-300 sm:text-lg"
        >
          Lens
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-xs tracking-wide text-zinc-500 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={scrollToSearch}
          className="whitespace-nowrap rounded-full border border-white/40 px-5 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/5 sm:px-7 sm:py-2 sm:text-sm"
        >
          Try Lens
        </button>
      </div>
    </header>
  )
}
