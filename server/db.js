import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Conexion a PostgreSQL.
// Define DATABASE_URL en tu archivo .env, por ejemplo:
//   DATABASE_URL=postgresql://usuario:password@host:5432/itsio
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.warn('[ITSIO API] ADVERTENCIA: DATABASE_URL no esta definida. Configura tu archivo .env')
}

export const pool = new Pool({
  connectionString,
  // Muchos proveedores (Neon, Supabase, etc.) requieren SSL.
  ssl: connectionString && connectionString.includes('localhost')
    ? false
    : { rejectUnauthorized: false }
})

// Helper para consultas
export async function query(text, params) {
  const res = await pool.query(text, params)
  return res.rows
}
