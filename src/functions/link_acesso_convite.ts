import { redis } from '../redis/client'
import { db } from '../drizzle/client';
import { eq } from 'drizzle-orm';
import { inscricoes } from '../drizzle/tables/inscricoes';

interface linkAcessoConviteParams {
  inscritoId: string
}

export async function linkAcessoConvite({
  inscritoId,
}: linkAcessoConviteParams) {
  // verifica se o inscritoId existe
  const inscrito = await db
    .select()
    .from(inscricoes)
    .where(eq(inscricoes.id, inscritoId))

  if (inscrito.length === 0) {
    throw new Error('Inscrito não encontrado.')
  }

  await redis.hincrby('referencia:contagem-acesso', inscritoId, 1)
}
