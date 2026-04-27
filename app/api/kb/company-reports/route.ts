import { NextRequest, NextResponse } from 'next/server';
import { getCompanyReports } from '@/app/lib/kb';

export async function POST(req: NextRequest) {
  try {
    const { ticker } = await req.json();
    if (!ticker?.trim()) return NextResponse.json({ error: 'ticker required' }, { status: 400 });
    const reports = await getCompanyReports(ticker.toUpperCase());
    return NextResponse.json({ reports });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
