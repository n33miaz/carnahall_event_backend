import { eq } from 'drizzle-orm'
import { PostgresError } from 'postgres'
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
  try {
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
  } catch (error) {
    if (error instanceof PostgresError) {
      // trata erros específicos do Postgres (ex: violação de chave única, problema de conexão)
      console.error(
        'Erro no Postgres:',
        error.message,
        error.code,
        error.detail
      )
      throw new Error('Erro ao inserir inscrição no banco de dados.') // lança um erro genérico
    } else if (error instanceof Error && error.message.startsWith('ERR')) {
      // trata erros do Redis
      console.error('Erro no Redis:', error.message)
      throw new Error('Erro ao atualizar ranking no Redis.')
    } else {
      // outros erros (incluindo erros de rede com Redis)
      console.error('Erro inesperado:', error)
      throw new Error('Erro inesperado ao processar a inscrição.') // lança um erro genérico
    }
  }
}
