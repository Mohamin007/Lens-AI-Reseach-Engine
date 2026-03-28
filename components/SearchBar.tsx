'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const EXAMPLE_QUERIES = [
  'What causes chronic inflammation?',
  'Latest breakthroughs in quantum computing...',
  'History of the Silk Road...',
  'How does CRISPR gene editing work?',
  'Economic impact of climate change...',
] as const;

interface SearchBarProps {
  /** Extra classes on the `<form>` (e.g. max-width, z-index) */
  className?: string;
  /** Inner container classes (merged with layout base); omit for default frosted bar */
  innerClassName?: string;
  /** Optional external trigger to fill the input and auto-submit */
  submitQuerySignal?: {
    text: string;
    nonce: number;
  } | null;
}

export function SearchBar({ className = '', innerClassName = '', submitQuerySignal = null }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const schedule = (fn: () => void, ms: number) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    let exampleIndex = 0;
    let charPos = 0;
    type Phase = 'typing' | 'pauseTyped' | 'deleting' | 'pauseNext';
    let phase: Phase = 'typing';

    const tick = () => {
      if (cancelled) return;
      const full = EXAMPLE_QUERIES[exampleIndex];

      if (phase === 'typing') {
        if (charPos < full.length) {
          charPos += 1;
          setPlaceholderText(full.slice(0, charPos));
          schedule(tick, 52);
        } else {
          phase = 'pauseTyped';
          schedule(() => {
            phase = 'deleting';
            tick();
          }, 2300);
        }
      } else if (phase === 'deleting') {
        if (charPos > 0) {
          charPos -= 1;
          setPlaceholderText(full.slice(0, charPos));
          schedule(tick, 40);
        } else {
          exampleIndex = (exampleIndex + 1) % EXAMPLE_QUERIES.length;
          phase = 'pauseNext';
          schedule(() => {
            phase = 'typing';
            tick();
          }, 550);
        }
      }
    };

    schedule(tick, 280);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/research?q=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    if (!submitQuerySignal?.text?.trim()) return;
    const nextQuery = submitQuerySignal.text.trim();
    setQuery(nextQuery);
    router.push(`/research?q=${encodeURIComponent(nextQuery)}`);
  }, [submitQuerySignal, router]);

  const innerBase = 'group w-full relative flex items-center';
  const innerDefault = `${innerBase} px-6 sm:px-8 py-4 sm:py-5 bg-white/[0.03] backdrop-blur-md border border-white/15 rounded-xl transition-colors focus-within:border-white/25`;
  const inner = innerClassName ? `${innerBase} ${innerClassName}` : innerDefault;

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative z-30 flex w-full items-center pointer-events-auto ${className}`}
    >
      <div className={inner}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholderText}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-sm sm:text-base"
        />

        <button
          type="submit"
          aria-label="Search"
          className="relative z-10 ml-3 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-gray-600/40 text-gray-300 transition-all duration-200 hover:bg-gray-500/50 hover:border-white/30 sm:h-11 sm:w-11"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </form>
  );
}
