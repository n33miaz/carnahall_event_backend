import { inArray } from 'drizzle-orm'
import { db } from '../drizzle/client'
import { inscricoes } from '../drizzle/tables/inscricoes'
import { redis } from '../redis/client'

export async function ranking() {
  // retorna uma qntd predefinida de dados sobre um ranking (maior para o menor)
  const ranking = await redis.zrevrange(
    'referencia:ranking',
    0,
    2,
    'WITHSCORES'
  )

  const inscritoIdEPontuacao: Record<string, number> = {}

  for (let i = 0; i < ranking.length; i += 2) {
    inscritoIdEPontuacao[ranking[i]] = Number.parseInt(ranking[i + 1])
  }

  const inscritos = await db
    .select()
    .from(inscricoes)
    .where(inArray(inscricoes.id, Object.keys(inscritoIdEPontuacao)))

  const rankingComPontuacao = inscritos
    .map(inscrito => {
      return {
        id: inscrito.id,
        nome: inscrito.nome,
        pontuacao: inscritoIdEPontuacao[inscrito.id],
      }
    })
    .sort((sub1, sub2) => {
      return sub2.pontuacao - sub1.pontuacao
    })

  return { rankingComPontuacao }
}
