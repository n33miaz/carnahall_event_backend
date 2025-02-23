import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from '../env'
import { inscricoes } from '../drizzle/tables/inscricoes'

export const pg = postgres(env.POSTGRESQL_URL)
export const db = drizzle(pg, {
    schema: {
        inscricoes,
    },
});