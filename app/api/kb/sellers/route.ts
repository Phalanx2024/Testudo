import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED });

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT
        short_seller AS seller,
        COUNT(*)::int                         AS total_reports,
        MAX(publication_date)::text           AS latest_report,
        MIN(publication_date)::text           AS first_report
      FROM short_reports
      WHERE short_seller IS NOT NULL
      GROUP BY short_seller
      ORDER BY total_reports DESC
    `);
    return NextResponse.json({ sellers: rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
