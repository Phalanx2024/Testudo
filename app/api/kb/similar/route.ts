import { NextRequest, NextResponse } from 'next/server';
import { embedQuery, searchChunks } from '@/app/lib/kb';

export async function POST(req: NextRequest) {
  try {
    const { description, sector, limit = 10 } = await req.json();
    if (!description?.trim()) return NextResponse.json({ error: 'description required' }, { status: 400 });

    const embedding = await embedQuery(description);
    const chunks = await searchChunks(embedding, limit * 2, undefined, undefined);

    // Deduplicate by ticker, keep highest similarity, optionally filter sector
    const seen = new Map<string, any>();
    for (const c of chunks) {
      if (!c.ticker) continue;
      if (sector && !c.gics_sector?.toLowerCase().includes(sector.toLowerCase())) continue;
      if (!seen.has(c.ticker) || c.similarity > seen.get(c.ticker).similarity) {
        seen.set(c.ticker, c);
      }
    }

    const results = Array.from(seen.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
