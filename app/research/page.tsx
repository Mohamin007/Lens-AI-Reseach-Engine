'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { AgentCard } from '@/components/AgentCard';
import { Agent } from '@/lib/types';

const initialAgents: Agent[] = [
  {
    id: 'search',
    name: 'Search Agent',
    description: 'Searching the web for relevant information',
    status: 'queued',
    progress: 0,
    logs: [],
    icon: '🔍',
  },
  {
    id: 'scrape',
    name: 'Scrape Agent',
    description: 'Extracting data from sources',
    status: 'queued',
    progress: 0,
    logs: [],
    icon: '🕷️',
  },
  {
    id: 'synthesis',
    name: 'Synthesis Agent',
    description: 'Synthesizing findings with AI',
    status: 'queued',
    progress: 0,
    logs: [],
    icon: '🧠',
  },
];

type Star = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  base: number;
};

function DeepSpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];

    const buildStars = () => {
      stars = Array.from({ length: 200 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.4 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.003,
        base: 0.22 + Math.random() * 0.32,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, window.innerWidth);
      h = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      const nebula = ctx.createRadialGradient(w * 0.5, h * 0.48, 0, w * 0.5, h * 0.48, Math.max(w, h) * 0.48);
      nebula.addColorStop(0, 'rgba(98, 70, 190, 0.12)');
      nebula.addColorStop(0.45, 'rgba(65, 102, 190, 0.07)');
      nebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);

      for (const star of stars) {
        star.phase += star.speed;
        const twinkle = (Math.sin(star.phase) + 1) * 0.5;
        const alpha = star.base + twinkle * 0.22;
        ctx.beginPath();
        ctx.arc(star.x * w, star.y * h, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235,245,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-90" aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(120,110,220,0.08) 0%, rgba(68,110,208,0.05) 36%, rgba(0,0,0,0) 72%)',
        }}
      />
    </div>
  );
}

export default function ResearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || 'default research query';

  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFatalError, setHasFatalError] = useState(false);

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  useEffect(() => {
    const run = async () => {
      // STEP 1: Search Agent
      updateAgent('search', { status: 'running', progress: 10, logs: ['Initializing search...'] });
      await new Promise((r) => setTimeout(r, 800));
      updateAgent('search', { progress: 40, logs: ['Querying Exa search engine...'] });

      let searchResults: any[] = [];
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        const data = await res.json();
        searchResults = data.results || [];
        if (searchResults.length === 0) {
          updateAgent('search', {
            status: 'error',
            progress: 100,
            logs: ['No results returned from Exa search'],
          });
          setHasFatalError(true);
          return;
        }
        updateAgent('search', {
          progress: 100,
          status: 'completed',
          logs: [`Found ${searchResults.length} relevant sources`],
        });
      } catch (e) {
        updateAgent('search', { status: 'error', progress: 100, logs: ['Exa search failed'] });
        setHasFatalError(true);
        return;
      }

      await new Promise((r) => setTimeout(r, 500));

      // STEP 2: Scrape Agent
      updateAgent('scrape', { status: 'running', progress: 10, logs: ['Starting content extraction...'] });
      await new Promise((r) => setTimeout(r, 800));

      for (let i = 0; i < searchResults.length; i++) {
        const percent = Math.round(((i + 1) / searchResults.length) * 100);
        updateAgent('scrape', {
          progress: percent,
          logs: [`Extracting: ${searchResults[i]?.url || 'source ' + (i + 1)}`],
        });
        await new Promise((r) => setTimeout(r, 400));
      }

      // STEP 2: Scrape Agent
      updateAgent('scrape', { status: 'running', progress: 10, logs: ['Starting Apify crawler...'] });
      await new Promise((r) => setTimeout(r, 500));

      let scrapedData: any[] = [];
      try {
        const urls = searchResults.slice(0, 2).map((r: any) => r.url).filter(Boolean);
        updateAgent('scrape', { progress: 40, logs: [`Crawling top ${urls.length} sources...`] });

        const scrapeRes = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls }),
        });
        const scrapeJson = await scrapeRes.json();
        scrapedData = scrapeJson.scrapedData || [];

        updateAgent('scrape', {
          status: 'completed',
          progress: 100,
          logs: [`Apify extracted ${scrapedData.length} full pages`],
        });
      } catch (e) {
        updateAgent('scrape', { status: 'completed', progress: 100, logs: ['Scraping completed'] });
      }

      await new Promise((r) => setTimeout(r, 500));

      // STEP 3: Synthesis Agent
      updateAgent('synthesis', { status: 'running', progress: 20, logs: ['Preparing synthesis...'] });
      await new Promise((r) => setTimeout(r, 600));
      updateAgent('synthesis', { progress: 50, logs: ['Groq AI synthesizing findings...'] });

      let finalResult = '';
      try {
        const res = await fetch('/api/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, searchResults, scrapedData }),
        });
        const data = await res.json();
        finalResult = data.result || '';
        if (!finalResult.trim()) {
          updateAgent('synthesis', {
            status: 'error',
            progress: 100,
            logs: ['Groq synthesis failed'],
          });
          setHasFatalError(true);
          return;
        }
        updateAgent('synthesis', {
          status: 'completed',
          progress: 100,
          logs: ['Synthesis complete!'],
        });
      } catch (e) {
        updateAgent('synthesis', { status: 'error', progress: 100, logs: ['Groq synthesis failed'] });
        setHasFatalError(true);
        return;
      }

      setIsComplete(true);

      setTimeout(() => {
        router.push(`/result?q=${encodeURIComponent(query)}&result=${encodeURIComponent(finalResult)}&sources=${encodeURIComponent(JSON.stringify(searchResults.slice(0, 5).map((r: any) => ({ title: r.title, url: r.url }))))}`);
      }, 2000);
    };

    run();
  }, [query, router]);

  return (
    <div className="min-h-screen bg-black">
      <DeepSpaceBackground />

      <Header />

      <main className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
        {hasFatalError ? (
          <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-3xl items-center justify-center">
            <section
              className="w-full max-w-xl rounded-2xl border border-orange-400/40 bg-black/45 p-8 text-center shadow-[0_0_0_1px_rgba(251,146,60,0.25),0_0_32px_rgba(239,68,68,0.18),0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-lg"
              aria-labelledby="research-failed-title"
            >
              <div className="text-4xl" aria-hidden>
                ⚠️
              </div>
              <h1 id="research-failed-title" className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                Research Failed
              </h1>
              <p className="mt-3 text-sm text-zinc-300 sm:text-base">
                Something went wrong while researching your query. Please try again.
              </p>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="mt-7 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-orange-300/60 hover:bg-white/15 hover:shadow-[0_0_18px_rgba(251,146,60,0.2)]"
              >
                Try Again
              </button>
            </section>
          </div>
        ) : null}

        {!hasFatalError ? (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              Research in Progress
            </h1>
            <p className="text-gray-400 text-sm sm:text-lg break-words">
              Analyzing: <span className="text-blue-400 font-semibold">{query}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          <div className="text-center text-xs sm:text-sm text-gray-400">
            {isComplete ? (
              <div className="text-green-400 font-semibold">
                ✓ Research Complete - Redirecting to results...
              </div>
            ) : (
              <div>Working with 3 AI agents to analyze your query. This typically takes 10-20 seconds.</div>
            )}
          </div>
        </div>
        ) : null}
      </main>
    </div>
  );
}