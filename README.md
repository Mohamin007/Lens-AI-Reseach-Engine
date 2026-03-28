# Lens — AI Research Engine

> Multi-agent AI research engine that searches the web, scrapes sources, and synthesizes comprehensive research reports in seconds.

🔗 **Live Demo:** [lenssearch.vercel.app](https://lenssearch.vercel.app)

---

## What is Lens?https://github.com/Mohamin007/Lens-AI-Reseach-Engine/settings

Lens is a multi-agent research engine built for the Cursor Hackathon Kashmir 2026. Instead of giving you a simple AI-generated answer, Lens deploys 3 specialized agents that work together to deliver deep, sourced, and synthesized research reports.

---

## How it Works
```
User Query → Search Agent → Scrape Agent → Synthesis Agent → Research Report
```

### The 3 Agents

| Agent | Tool | What it does |
|---|---|---|
| 🔍 Search Agent | Exa API | Semantically searches the live web for relevant sources |
| 🕷️ Scrape Agent | Apify | Crawls and extracts full page content from top sources |
| 🧠 Synthesis Agent | Groq + Llama | Synthesizes all data into a comprehensive research report |

---

## Why This Architecture?

Most AI tools answer from training data. Lens answers from **live web data**.

- **Exa** fetches up to 1000 characters per source — enough for context
- **Apify** crawls full pages for the top 2 sources — richer, deeper data
- **Groq** synthesizes everything into a structured, cited report
- If we had a larger context LLM, Apify's full content would make results even more detailed

---

## Tech Stack

- **Frontend:** Next.js 16, Tailwind CSS, React 19
- **Search:** Exa API (semantic web search)
- **Scraping:** Apify (Website Content Crawler)
- **AI Synthesis:** Groq API (Llama 3.3 70B)
- **Deployment:** Vercel
- **Built with:** Cursor AI, v0 by Vercel

---

## Sponsor Tracks

- ✅ **Cursor** — Built entirely using Cursor AI
- ✅ **Exa** — Core search agent
- ✅ **Apify** — Core scraping agent  
- ✅ **v0 by Vercel** — UI components generated with v0
- ✅ **Groq** — AI synthesis engine
- ✅ **Mobbin** — UI/UX design inspiration

---

## Features

- 🔍 Real-time web search with semantic understanding
- 🕷️ Full page content extraction from top sources
- 🧠 AI-synthesized research reports with markdown formatting
- 📚 Clickable source citations
- ⚡ Live agent progress visualization
- 🎨 Beautiful dark UI with animations
- 📱 Fully responsive

---

## Local Development
```bash
# Clone the repo
git clone https://github.com/Mohamin007/Lens---AI-Reseach-Engine.git

# Install dependencies
pnpm install

# Add environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Run development server
pnpm dev
```

### Environment Variables
```
EXA_API_KEY=your_exa_key
GROQ_API_KEY=your_groq_key
APIFY_API_KEY=your_apify_key
```

---

## Built At

**Cursor Hackathon Kashmir 2026**
NIT Srinagar, Kashmir, India

---

## Developer

**Mohamin Mushtaq Mir**

---

*Built with ❤️ in Kashmir*
