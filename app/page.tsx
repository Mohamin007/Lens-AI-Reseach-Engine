'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SearchBar } from '@/components/SearchBar'

const scrollNavItems = [
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
] as const

const POWERED_BADGES = [
  { name: 'Exa', tone: 'blue' },
  { name: 'Apify', tone: 'orange' },
  { name: 'Groq', tone: 'green' },
] as const
const QUERY_SUGGESTIONS = [
  'What are the latest cancer treatment breakthroughs?',
  'How does quantum computing work?',
  'Climate change solutions in 2025',
  'History of artificial intelligence',
] as const

const ORB_BLUE = { r: 168, g: 216, b: 255 } // #a8d8ff
const ORB_PURPLE = { r: 196, g: 168, b: 255 } // #c4a8ff
const MIN_ORBS = 15
const MAX_ORBS = 30

type UpParticle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  life: number
  maxLife: number
  mode: 'white' | 'blue' | 'purple'
}

type LensFloatingParticlesProps = {
  /** Element that defines spawn bounds (the hero Lens title) */
  titleId: string
  className?: string
}

/** Canvas orbs: spawn inside measured “Lens” bounds, rise, drift, fade — 15–20 alive */
function LensFloatingParticles({ titleId, className = '' }: LensFloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: UpParticle[] = []
    let raf = 0
    let w = 0
    let h = 0

    const resize = () => {
      const rect = container.getBoundingClientRect()
      let nextW = rect.width
      let nextH = rect.height

      // If the absolute container measures as ~0 on first paint, fallback to title bounds.
      if (nextW < 2 || nextH < 2) {
        const titleEl = document.getElementById(titleId)
        if (titleEl) {
          const t = titleEl.getBoundingClientRect()
          nextW = Math.max(nextW, t.width)
          nextH = Math.max(nextH, t.height + 180)
        }
      }

      w = Math.max(1, nextW)
      h = Math.max(1, nextH)
      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const getLensTextRect = (): { x: number; y: number; bw: number; bh: number } | null => {
      const el = document.getElementById(titleId)
      if (!el) return null
      const c = container.getBoundingClientRect()
      const t = el.getBoundingClientRect()
      const x = t.left - c.left
      const y = t.top - c.top
      const bw = t.width
      const bh = t.height
      if (bw < 4 || bh < 4 || !Number.isFinite(x) || !Number.isFinite(y)) return null
      return { x, y, bw, bh }
    }

    const spawnInTextArea = (b: { x: number; y: number; bw: number; bh: number }) => {
      if (particles.length >= MAX_ORBS) return
      const x = b.x + Math.random() * b.bw
      const y = b.y + Math.random() * b.bh
      const roll = Math.random()
      const mode: UpParticle['mode'] = roll < 0.33 ? 'white' : roll < 0.66 ? 'blue' : 'purple'
      const r = 4 + Math.random() * 4
      const maxLife = 200 + Math.floor(Math.random() * 140)
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.18 + Math.random() * 0.28),
        r,
        life: 0,
        maxLife,
        mode,
      })
    }

    const drawParticle = (p: UpParticle) => {
      const t = p.life / p.maxLife
      const fadeIn = Math.min(1, t / 0.06)
      const fadeOut = (1 - t) ** 1.25
      const riseFade = Math.max(0.35, 1 - Math.max(0, p.y) / Math.max(h * 0.55, 100) * 0.2)
      const alpha = Math.min(fadeIn, fadeOut) * riseFade

      const { r: cr, g: cg, b: cb } =
        p.mode === 'blue' ? ORB_BLUE : p.mode === 'purple' ? ORB_PURPLE : { r: 255, g: 255, b: 255 }

      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 1)
      g.addColorStop(0, `rgba(${cr},${cg},${cb},${Math.min(0.5, alpha * 0.5)})`)
      g.addColorStop(0.5, `rgba(${cr},${cg},${cb},${alpha * 0.42})`)
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    }

    const loop = () => {
      const bounds = w > 0 && h > 0 ? getLensTextRect() : null

      if (w > 0 && h > 0) {
        ctx.clearRect(0, 0, w, h)
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life += 1
        p.x += p.vx
        p.y += p.vy
        p.vx += (Math.random() - 0.5) * 0.012
        p.vx = Math.max(-0.55, Math.min(0.55, p.vx))
        if (p.life >= p.maxLife || p.y < -p.r * 4) {
          particles.splice(i, 1)
        }
      }

      if (bounds) {
        while (particles.length < MIN_ORBS) {
          spawnInTextArea(bounds)
        }
        if (particles.length < MAX_ORBS && Math.random() < 0.22) {
          spawnInTextArea(bounds)
        }
      }

      if (w > 0 && h > 0) {
        for (const p of particles) {
          drawParticle(p)
        }
      }

      raf = requestAnimationFrame(loop)
    }

    const onWindowResize = () => resize()
    window.addEventListener('resize', onWindowResize, { passive: true })

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        resize()
      })
      ro.observe(container)
      const parent = container.parentElement
      if (parent) ro.observe(parent)
    }

    const kickoff = () => {
      resize()
      raf = requestAnimationFrame(loop)
    }
    requestAnimationFrame(() => requestAnimationFrame(kickoff))

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onWindowResize)
      ro?.disconnect()
    }
  }, [titleId])

  return (
    <div ref={containerRef} className={`relative min-h-[1px] min-w-[1px] overflow-visible ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden />
    </div>
  )
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function LensDashboard() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [glowPos, setGlowPos] = useState<{ x: number; y: number } | null>(null)
  const [submitQuerySignal, setSubmitQuerySignal] = useState<{ text: string; nonce: number } | null>(null)

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setGlowPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    if (!aboutOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAboutOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [aboutOpen])

  const closeAbout = useCallback(() => setAboutOpen(false), [])

  return (
    <div className="relative bg-[#020202] font-sans text-white">
      <div
        className="pointer-events-none fixed z-[4] h-[min(18rem,30vw)] w-[min(18rem,30vw)] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen transition-opacity duration-300"
        style={{
          left: glowPos?.x ?? '20%',
          top: glowPos?.y ?? '20%',
          background:
            'radial-gradient(circle at center, rgba(129,140,248,0.22) 0%, rgba(99,102,241,0.1) 28%, rgba(59,130,246,0.06) 45%, transparent 68%)',
          opacity: glowPos ? 0.95 : 0.5,
        }}
        aria-hidden
      />

      {/* 1. THE ATMOSPHERIC LIGHT (Right Side) */}
      <div className="pointer-events-none absolute top-0 right-0 z-0 h-full w-[80%]">
        <div
          className="absolute top-0 right-[-10%] h-full w-full opacity-40"
          style={{
            background: 'radial-gradient(circle at 80% 40%, #1e3a8a 0%, transparent 60%)',
            filter: 'blur(120px)',
          }}
        />
        <div
          className="absolute top-[10%] right-[-20%] h-[80%] w-[70%] opacity-70"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(100,150,255,0.1) 40%, transparent 70%)',
            filter: 'blur(80px)',
            transform: 'rotate(-15deg)',
          }}
        />
        <div
          className="absolute top-0 right-0 h-full w-[40%] opacity-30"
          style={{
            background: 'linear-gradient(to left, rgba(255,255,255,0.85), transparent)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <header className="relative z-20 flex items-center justify-between px-8 py-6">
          <div className="flex items-center space-x-12">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-white transition-colors hover:text-zinc-300"
            >
              Lens
            </Link>
            <nav className="hidden items-center space-x-8 text-[11px] font-semibold tracking-wide text-gray-400 md:flex">
              {scrollNavItems.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="transition-colors hover:text-white"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId(href.slice(1))
                  }}
                >
                  {label}
                </a>
              ))}
              <button
                type="button"
                className="transition-colors hover:text-white"
                onClick={() => setAboutOpen(true)}
              >
                About
              </button>
            </nav>
          </div>
          <button
            type="button"
            onClick={() => scrollToId('search')}
            className="rounded-full border border-gray-700 px-6 py-2 text-[11px] font-semibold tracking-wide transition-all hover:bg-white hover:text-black"
          >
            Try Lens
          </button>
        </header>

        <main className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center">
          <div className="relative mx-auto w-fit max-w-[95vw] mb-8">
            <LensFloatingParticles
              titleId="lens-hero-title"
              className="pointer-events-none absolute inset-x-0 bottom-0 top-[-7.5rem] z-[5] sm:top-[-9rem] md:top-[-11rem]"
            />
            <h1
              id="lens-hero-title"
              className="animate-hero-title relative z-[6] max-w-[95vw] cursor-default text-center text-[clamp(3.5rem,14vw,12rem)] font-medium leading-none tracking-[-0.06em] md:text-[clamp(4rem,17vw,19rem)]"
              style={{
                background: 'linear-gradient(135deg, #444 0%, #fff 45%, #fff 55%, #88aacc 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: [
                  '0 0 0.5px rgba(255,255,255,0.98)',
                  '0 0 0.5px rgba(224,242,254,0.9)',
                  '0 0 0.5px rgba(147,197,253,0.65)',
                  '0 0 0.5px rgba(99,102,241,0.38)',
                  '0 0 0.5px rgba(255,255,255,0.95)',
                  '0 0 0.5px rgba(191,219,254,1)',
                ].join(', '),
                filter: [
                  'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
                  'drop-shadow(0 0 20px rgba(186,230,253,0.42))',
                  'drop-shadow(0 0 36px rgba(129,140,248,0.28))',
                ].join(' '),
              }}
            >
              Lens
            </h1>
          </div>

          <div
            id="search"
            className="animate-hero-search relative z-30 mt-2 w-full max-w-[900px] scroll-mt-28 px-6 sm:-mt-4 md:-mt-6"
          >
            <SearchBar
              innerClassName="h-[4.25rem] px-6 sm:px-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md transition-colors focus-within:border-white/30"
              className="[&_input]:text-lg [&_input]:placeholder:text-gray-600"
              submitQuerySignal={submitQuerySignal}
            />

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {QUERY_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setSubmitQuerySignal({ text: suggestion, nonce: Date.now() + Math.random() })}
                  className="rounded-full border border-white/20 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/95 backdrop-blur-md transition-all duration-300 hover:border-blue-300/45 hover:bg-white/[0.1] hover:shadow-[0_0_0_1px_rgba(191,219,254,0.2),0_0_18px_rgba(96,165,250,0.2)] sm:px-4 sm:py-2"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </main>

        <footer className="relative z-20 mt-auto flex justify-center px-8 pb-10 pt-6 md:px-12">
          <div className="flex max-w-4xl flex-col items-center gap-6 md:gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-powered-badges flex flex-wrap items-center justify-center gap-3">
                {POWERED_BADGES.map(({ name, tone }, i) => (
                  <span
                    key={name}
                    className={`inline-flex items-center gap-2 rounded-full border bg-white/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-200 backdrop-blur-md ${
                      tone === 'blue'
                        ? 'badge-pill-blue'
                        : tone === 'orange'
                          ? 'badge-pill-orange'
                          : 'badge-pill-green'
                    }`}
                    style={{
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        tone === 'blue'
                          ? 'bg-sky-300'
                          : tone === 'orange'
                            ? 'bg-orange-300'
                            : 'bg-emerald-300'
                      }`}
                    />
                    {name}
                  </span>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500">Powered by</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => scrollToId('search')}
                className="rounded-full border border-gray-700 bg-black/50 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-all hover:border-white"
              >
                Build with Lens
              </button>
              <button
                type="button"
                onClick={() => scrollToId('features')}
                className="rounded-full border border-gray-700 bg-black/50 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-all hover:border-white"
              >
                Learn More
              </button>
            </div>
          </div>
        </footer>
      </div>

      {aboutOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            aria-label="Close about"
            onClick={closeAbout}
          />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/12 bg-zinc-950/85 p-6 shadow-[0_0_60px_-12px_rgba(99,102,241,0.35)] backdrop-blur-xl sm:p-8">
            <h2 id="about-modal-title" className="mb-4 text-xl font-semibold text-white sm:text-2xl">
              About Lens
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
              Lens is a multi-agent AI research engine. It coordinates specialized agents to search the
              open web, extract and structure content, and synthesize clear, grounded answers—powered
              by{' '}
              <span className="font-medium text-zinc-200">Exa</span> for discovery,{' '}
              <span className="font-medium text-zinc-200">Apify</span> for reliable web data, and{' '}
              <span className="font-medium text-zinc-200">Groq</span> for fast inference.
            </p>
            <button
              type="button"
              onClick={closeAbout}
              className="mt-8 w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:w-auto sm:px-8"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-white/10 bg-[#020202] px-8 py-20 md:px-12"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-xl font-semibold text-white sm:text-2xl">How it Works</h2>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Ask a question in natural language. Lens searches the web, gathers sources, and
            synthesizes a clear answer backed by citations.
          </p>
        </div>
      </section>

      <section
        id="features"
        className="scroll-mt-24 border-t border-white/10 bg-[#020202] px-8 py-20 md:px-12"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-xl font-semibold text-white sm:text-2xl">Features</h2>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Deep research flows, multi-agent pipelines, and exportable results—built for fast,
            trustworthy answers.
          </p>
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-24 border-t border-white/10 bg-[#020202] px-8 py-20 md:px-12"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-xl font-semibold text-white sm:text-2xl">About</h2>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            Lens is a research assistant that combines modern search, scraping, and large language
            models to help you go from question to insight.
          </p>
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            className="mt-6 text-sm font-medium text-sky-400/90 transition-colors hover:text-sky-300"
          >
            Read more in the About dialog →
          </button>
        </div>
      </section>

      <p className="pointer-events-none fixed bottom-4 left-4 z-30 text-[10px] font-medium tracking-wide text-zinc-400/40">
        Developed by Mohamin Mushtaq Mir
      </p>
    </div>
  )
}
