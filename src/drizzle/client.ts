import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { inscricoes } from '../drizzle/tables/inscricoes'
import { env } from '../env'

export const pg = postgres(env.POSTGRESQL_URL)
export const db = drizzle(pg, {
  schema: {
    inscricoes,
  },
})
