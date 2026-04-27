// Knowledge base helpers — shared between API routes
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED });

export async function embedQuery(query: string): Promise<number[]> {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: [query], model: 'voyage-finance-2', input_type: 'query' }),
  });
  if (!res.ok) throw new Error(`Voyage API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.data[0].embedding;
}

export async function searchChunks(
  embedding: number[],
  limit = 8,
  ticker?: string,
  seller?: string,
) {
  const vec = `[${embedding.join(',')}]`;
  const conditions: string[] = [];
  const params: (string | number)[] = [vec, vec];

  if (ticker) { conditions.push(`ticker ILIKE $${params.length + 1}`); params.push(`%${ticker}%`); }
  if (seller) { conditions.push(`seller ILIKE $${params.length + 1}`); params.push(`%${seller}%`); }
  conditions.push(`chunk_text IS NOT NULL`);

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(limit);

  const { rows } = await pool.query(`
    SELECT
      chunk_text, seller, ticker, pub_date::text, chunk_type,
      ROUND((1 - (embedding <-> $1::vector))::numeric, 3) AS similarity
    FROM report_embeddings
    ${where}
    ORDER BY embedding <-> $2::vector
    LIMIT $${params.length}
  `, params);

  return rows;
}

export async function getCompanyReports(ticker: string) {
  const { rows } = await pool.query(`
    SELECT
      sr.report_title, src.short_seller AS seller,
      sr.publication_date::text AS pub_date, sr.link,
      src.ticker, src.exchange_code, src.gics_sector,
      src.confidence_score
    FROM short_reports sr
    JOIN short_reports_cleaned src ON sr.id = src.id
    WHERE src.ticker ILIKE $1
    ORDER BY sr.publication_date DESC
  `, [ticker]);
  return rows;
}
