import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED });

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT
        short_seller AS scraper,
        COUNT(*)::int                                                    AS total,
        COUNT(*) FILTER (WHERE last_update >= NOW() - INTERVAL '7 days')::int  AS last_7d,
        COUNT(*) FILTER (WHERE last_update >= NOW() - INTERVAL '30 days')::int AS last_30d,
        MAX(publication_date)::text                                      AS latest_pub,
        MAX(last_update)::text                                           AS latest_update,
        COUNT(*) FILTER (WHERE content_status = 'pending')::int         AS pending,
        COUNT(*) FILTER (WHERE content_status = 'processed')::int       AS processed,
        COUNT(*) FILTER (WHERE content_status = 'failed')::int          AS failed
      FROM short_reports
      WHERE short_seller IS NOT NULL
      GROUP BY short_seller
      ORDER BY latest_update DESC NULLS LAST
    `);

    const summary = {
      total_scrapers: rows.length,
      active_7d: rows.filter(r => r.last_7d > 0).length,
      total_reports_7d: rows.reduce((s, r) => s + r.last_7d, 0),
      total_reports_30d: rows.reduce((s, r) => s + r.last_30d, 0),
      last_run: rows[0]?.latest_update ?? null,
    };

    return NextResponse.json({ summary, scrapers: rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
