import { redis } from '../redis/client'

interface contagemDeConvitesParams {
  inscritoId: string
}

export async function contagemDeConvites({
  inscritoId,
}: contagemDeConvitesParams) {
  const contagem = await redis.zscore('referencia:ranking', inscritoId)

  if (contagem) {
    return { contagem: Number.parseInt(contagem) }
  }
  return { contagem: 0 }
}
