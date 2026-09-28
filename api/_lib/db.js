import { neon } from '@neondatabase/serverless'

let sql = null

export function getSql() {
  if (sql) return sql
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not configured')
  sql = neon(url)
  return sql
}

// candidates.* columns are snake_case in Postgres already, but Neon's driver
// returns them as-is, so no mapping layer is needed on the way out.
export function firstRow(rows) {
  return rows?.[0] || null
}
