import { redis } from '../redis/client'

interface clicksDeConviteParams {
  inscritoId: string
}

export async function clicksDeConvite({ inscritoId }: clicksDeConviteParams) {
  const contagem = await redis.hget('referencia:contagem-acesso', inscritoId)

  return { contagem: contagem ? Number.parseInt(contagem) : 0 }
}
