import { NextRequest, NextResponse } from 'next/server';
import { embedQuery, searchChunks, getCompanyReports } from '@/app/lib/kb';

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.content[0].text;
}

async function getFinancials(ticker: string) {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 3600 } }
    );
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta ?? {};
    return {
      current_price: meta.regularMarketPrice,
      currency: meta.currency,
      exchange: meta.exchangeName,
      market_cap: meta.marketCap,
      fifty_two_week_high: meta.fiftyTwoWeekHigh,
      fifty_two_week_low: meta.fiftyTwoWeekLow,
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { ticker } = await req.json();
    if (!ticker?.trim()) return NextResponse.json({ error: 'ticker required' }, { status: 400 });

    const t = ticker.toUpperCase();

    // Gather context in parallel
    const [embedding, reports, financials] = await Promise.all([
      embedQuery(`short thesis fraud accounting ${t}`),
      getCompanyReports(t),
      getFinancials(t),
    ]);

    const similarChunks = await searchChunks(embedding, 6, t);
    const themeChunks   = await searchChunks(embedding, 4);

    const context = `
COMPANY: ${t}
LIVE FINANCIALS: ${financials ? JSON.stringify(financials, null, 2) : 'unavailable'}

HISTORICAL REPORTS ON ${t}:
${reports.slice(0, 5).map((r: any) =>
  `- ${r.seller} (${r.pub_date}): ${r.report_title}`
).join('\n') || 'None found in database.'}

RELEVANT SHORT SELLER RESEARCH (semantic match):
${similarChunks.map((c: any, i: number) =>
  `[${i+1}] ${c.seller} on ${c.ticker} (${c.pub_date}, similarity ${c.similarity}):\n"${c.chunk_text.slice(0, 400)}..."`
).join('\n\n')}

COMPARABLE PAST SHORT CAMPAIGNS (theme match):
${themeChunks.filter((c: any) => c.ticker?.toUpperCase() !== t).slice(0, 3).map((c: any) =>
  `- ${c.seller} on ${c.ticker}: "${c.chunk_text.slice(0, 200)}..."`
).join('\n')}
`.trim();

    const pitch = await callClaude(`You are an experienced short seller analyst. Using the research context below, generate a structured short pitch for ${t}.

Structure your response as:
## Executive Summary
## Short Thesis (3-5 bullet points)
## Key Red Flags
## Comparable Short Campaigns
## Valuation & Downside
## Catalysts
## Key Risks to the Short

Ground every claim in the provided research. Cite sources where possible (e.g. "per Hindenburg Research, 2023").
Be direct and analytical, not promotional.

---
${context}`);
    return NextResponse.json({ ticker: t, pitch, context_used: { reports: reports.length, chunks: similarChunks.length } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
