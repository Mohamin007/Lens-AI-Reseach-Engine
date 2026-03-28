import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();

    if (!urls || urls.length === 0) {
      return NextResponse.json({ scrapedData: [] });
    }

    const apifyToken = process.env.APIFY_API_KEY;

    if (!apifyToken) {
      return NextResponse.json({ scrapedData: [] });
    }

    // Only scrape top 2 URLs to avoid token limit issues
    const topUrls = urls.slice(0, 2);

    const response = await fetch(
      `https://api.apify.com/v2/acts/apify~website-content-crawler/run-sync-get-dataset-items?token=${apifyToken}&memory=256&timeout=30`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: topUrls.map((url: string) => ({ url })),
          maxCrawlPages: 1,
          crawlerType: 'cheerio',
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ scrapedData: [] });
    }

    const data = await response.json();

    const scrapedData = data
      .slice(0, 2)
      .map((item: any) => ({
        url: item.url,
        text: item.text?.slice(0, 2000) || '',
      }))
      .filter((item: any) => item.text);

    return NextResponse.json({ scrapedData });
  } catch (error) {
    console.error('Apify scrape error:', error);
    return NextResponse.json({ scrapedData: [] });
  }
}
