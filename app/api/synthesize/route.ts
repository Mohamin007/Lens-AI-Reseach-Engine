import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { query, searchResults } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const sourcesText = searchResults
      ? searchResults
          .map((r: any, i: number) => `Source ${i + 1}: ${r.title}\nURL: ${r.url}\nContent: ${r.text}`)
          .join('\n\n')
      : 'No sources available';

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert research synthesizer. Given a query and real web sources, write a comprehensive, well-structured research report. 
Format your response with clear sections:
## Overview
## Key Findings
## Detailed Analysis
## Conclusion

Be detailed, insightful, and cite the sources naturally in your writing. Write at least 400 words.`,
        },
        {
          role: 'user',
          content: `Research Query: "${query}"

Here are the real web sources found:

${sourcesText}

Please synthesize these into a comprehensive research report.`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || 'No result generated';

    return NextResponse.json({
      result,
      source: 'groq',
    });
  } catch (error) {
    console.error('Synthesis error:', error);
    return NextResponse.json(
      { error: 'Synthesis failed' },
      { status: 500 }
    );
  }
}