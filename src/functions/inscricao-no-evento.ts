import { eq } from 'drizzle-orm'
import { db } from '../drizzle/client'
import { inscricoes } from '../drizzle/tables/inscricoes'
import { redis } from '../redis/client'

interface inscricaoNoEventoParams {
  nome: string
  email: string
  referenciadorId?: string | null
}

export async function inscricaoNoEvento({
  nome,
  email,
  referenciadorId,
}: inscricaoNoEventoParams) {
  // busca no banco de dados algum acesso anterior
  const inscritos = await db
    .select()
    .from(inscricoes)
    .where(eq(inscricoes.email, email))

  if (inscritos.length > 0) {
    return { inscritoId: inscritos[0].id }
  }

  const resultado = await db
    .insert(inscricoes)
    .values({
      nome,
      email,
    })
    .returning()

  if (referenciadorId) {
    // pontua no ranking quem convidou
    await redis.zincrby('referencia:ranking', 1, referenciadorId) // sorted sets
  }

  const inscrito = resultado[0]
  return {
    inscritoId: inscrito.id,
  }
}
