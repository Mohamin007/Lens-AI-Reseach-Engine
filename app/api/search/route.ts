import Exa from 'exa-js';
import { NextRequest, NextResponse } from 'next/server';

const exa = new Exa(process.env.EXA_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    const results = await exa.searchAndContents(query, {
      numResults: 5,
      useAutoprompt: true,
      text: {
        maxCharacters: 1000,
      },
    });

    return NextResponse.json({ results: results.results });
  } catch (error) {
    console.error('Exa search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}