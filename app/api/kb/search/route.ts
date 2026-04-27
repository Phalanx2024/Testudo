import { NextRequest, NextResponse } from 'next/server';
import { embedQuery, searchChunks } from '@/app/lib/kb';

export async function POST(req: NextRequest) {
  try {
    const { query, limit = 8, ticker, seller } = await req.json();
    if (!query?.trim()) return NextResponse.json({ error: 'query required' }, { status: 400 });

    const embedding = await embedQuery(query);
    const results = await searchChunks(embedding, limit, ticker, seller);
    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
