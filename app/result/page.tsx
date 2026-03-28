'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

const resultMarkdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h2
      className="mt-8 mb-3 text-xl font-bold tracking-tight text-white first:mt-0 sm:text-2xl"
      {...props}
    >
      {children}
    </h2>
  ),
  h2: ({ children, ...props }) => (
    <h3
      className="mt-8 mb-3 border-b border-zinc-800 pb-2 text-lg font-semibold tracking-tight text-white first:mt-0 sm:text-xl"
      {...props}
    >
      {children}
    </h3>
  ),
  h3: ({ children, ...props }) => (
    <h4 className="mt-6 mb-2 text-base font-semibold text-zinc-100 sm:text-lg" {...props}>
      {children}
    </h4>
  ),
  h4: ({ children, ...props }) => (
    <h5 className="mt-5 mb-2 text-sm font-semibold text-zinc-200 sm:text-base" {...props}>
      {children}
    </h5>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-4 text-sm leading-relaxed text-zinc-300 last:mb-0 sm:text-base" {...props}>
      {children}
    </p>
  ),
  a: ({ children, href, ...props }) => {
    const external = Boolean(href?.startsWith('http'))
    return (
      <a
        href={href}
        className="font-medium text-sky-400 underline decoration-sky-400/40 underline-offset-2 transition-colors hover:text-sky-300 hover:decoration-sky-300"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : { rel: 'noopener noreferrer' })}
        {...props}
      >
        {children}
      </a>
    )
  },
  ul: ({ children, ...props }) => (
    <ul className="mb-4 list-disc space-y-2 pl-6 text-sm text-zinc-300 sm:text-base" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-6 text-sm text-zinc-300 sm:text-base" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed [&>p]:mb-1" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mb-4 border-l-4 border-zinc-600 pl-4 text-sm italic text-zinc-400 sm:text-base"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props) => <hr className="my-8 border-zinc-800" {...props} />,
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-zinc-100" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-zinc-200" {...props}>
      {children}
    </em>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="mb-4 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-200"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className?.includes('language-'))
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
    return (
      <code
        className="rounded-md bg-zinc-800 px-1.5 py-0.5 font-mono text-[0.875em] text-amber-100"
        {...props}
      >
        {children}
      </code>
    )
  },
}

export type ResultSource = { title: string; url: string }

type Star = {
  x: number
  y: number
  r: number
  phase: number
  speed: number
  base: number
}

function DeepSpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    let stars: Star[] = []

    const buildStars = () => {
      stars = Array.from({ length: 200 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.4 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.003,
        base: 0.22 + Math.random() * 0.32,
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.max(1, window.innerWidth)
      h = Math.max(1, window.innerHeight)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildStars()
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h)

      const nebula = ctx.createRadialGradient(w * 0.5, h * 0.48, 0, w * 0.5, h * 0.48, Math.max(w, h) * 0.48)
      nebula.addColorStop(0, 'rgba(98, 70, 190, 0.12)')
      nebula.addColorStop(0.45, 'rgba(65, 102, 190, 0.07)')
      nebula.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = nebula
      ctx.fillRect(0, 0, w, h)

      for (const star of stars) {
        star.phase += star.speed
        const twinkle = (Math.sin(star.phase) + 1) * 0.5
        const alpha = star.base + twinkle * 0.22
        ctx.beginPath()
        ctx.arc(star.x * w, star.y * h, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(235,245,255,${alpha.toFixed(3)})`
        ctx.fill()
      }

      raf = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-90" aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(120,110,220,0.08) 0%, rgba(68,110,208,0.05) 36%, rgba(0,0,0,0) 72%)',
        }}
      />
    </div>
  )
}

function parseSources(raw: string | null): ResultSource[] {
  if (!raw?.trim()) return []
  try {
    const decoded = decodeURIComponent(raw)
    const parsed: unknown = JSON.parse(decoded)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item): item is Record<string, unknown> => item !== null && typeof item === 'object')
      .map((item) => {
        const url = typeof item.url === 'string' ? item.url : ''
        const title = typeof item.title === 'string' ? item.title : 'Source'
        if (!url) return null
        return { title, url }
      })
      .filter((s): s is ResultSource => s !== null)
  } catch {
    return []
  }
}

function ResultPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const q = searchParams.get('q') ?? ''
  const resultText = searchParams.get('result') ?? 'No results available.'
  const sources = parseSources(searchParams.get('sources'))

  const handleCopy = () => {
    void navigator.clipboard.writeText(resultText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative min-h-screen bg-black text-zinc-100">
      <DeepSpaceBackground />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-56"
        style={{
          background:
            'linear-gradient(to bottom, rgba(30,58,138,0.38) 0%, rgba(59,62,163,0.24) 35%, rgba(0,0,0,0.92) 100%)',
        }}
      />

      <div className="animate-result-enter relative z-10 mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-600 bg-zinc-900/80 px-4 py-2.5 text-sm text-zinc-200 transition-colors hover:border-zinc-400 hover:bg-zinc-800"
          >
            <Copy className="h-4 w-4" aria-hidden />
            {copied ? 'Copied' : 'Copy result'}
          </button>
        </div>

        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl [text-shadow:0_0_10px_rgba(125,165,255,0.35),0_0_20px_rgba(167,139,250,0.2)]">
          Research result
        </h1>
        {q ? (
          <p className="mb-8 text-sm text-zinc-500">
            Query: <span className="text-zinc-300">{q}</span>
          </p>
        ) : (
          <p className="mb-8 text-sm text-zinc-500">No query in URL.</p>
        )}

        <section
          className="mb-6 rounded-2xl border border-indigo-400/30 bg-zinc-950/90 p-5 shadow-[0_0_0_1px_rgba(129,140,248,0.22),0_0_28px_rgba(99,102,241,0.16),0_22px_60px_rgba(0,0,0,0.45)] sm:p-8"
          aria-labelledby="result-heading"
        >
          <h2 id="result-heading" className="sr-only">
            Result
          </h2>
          <div className="[&>*:first-child]:mt-0">
            <ReactMarkdown components={resultMarkdownComponents}>{resultText}</ReactMarkdown>
          </div>
        </section>

        <section
          className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-5 shadow-xl sm:p-8"
          aria-labelledby="sources-heading"
        >
          <h2 id="sources-heading" className="mb-4 text-lg font-semibold text-white">
            Sources
          </h2>
          {sources.length === 0 ? (
            <p className="text-sm text-zinc-500">No sources provided.</p>
          ) : (
            <ul className="space-y-3">
              {sources.map((source, index) => (
                <li key={`${source.url}-${index}`}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-4 py-3 transition-all duration-300 hover:border-blue-400/50 hover:bg-zinc-900 hover:shadow-[0_0_0_1px_rgba(96,165,250,0.25),0_0_22px_rgba(59,130,246,0.2)]"
                  >
                    <span className="line-clamp-2 font-medium text-zinc-100">{source.title}</span>
                    <span className="mt-1 block truncate text-xs text-zinc-500">{source.url}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-zinc-500">
          Loading…
        </div>
      }
    >
      <ResultPageInner />
    </Suspense>
  )
}
