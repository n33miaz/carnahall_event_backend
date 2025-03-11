import { inArray, sql } from 'drizzle-orm' 
import { db } from '../drizzle/client'
import { inscricoes } from '../drizzle/tables/inscricoes'
import { redis } from '../redis/client'

export async function ranking() {
  // obter os IDs e scores do Redis, já ordenados
  const rankingData = await redis.zrevrange(
    'referencia:ranking',
    0,
    2,
    'WITHSCORES'
  )

  if (rankingData.length === 0) {
    return { rankingComPontuacao: [] } // retorna um array vazio se não houver ranking
  }

  // converter o resultado do Redis em um formato mais utilizável 
  const ranking: { id: string; pontuacao: number }[] = []
  for (let i = 0; i < rankingData.length; i += 2) {
    const id = rankingData[i]
    const score = Number(rankingData[i + 1]) // converte para número

    // adicionado tratamento para o caso de o score não ser um número válido
    if (isNaN(score)) {
      console.error(
        `Erro ao converter pontuação para número. ID: ${id}, Score: ${rankingData[i + 1]}`
      )
      continue // pula este item e continua com o loop, ou você pode lançar um erro aqui, se preferir
      // throw new Error(`Pontuação inválida para o ID ${id}: ${rankingData[i+1]}`); // alternativa: lançar erro
    }

    ranking.push({ id, pontuacao: score })
  }

  // buscar os dados dos inscritos no banco de dados, usando os IDs do Redis.
  const inscritos = await db
    .select({
      id: inscricoes.id,
      nome: inscricoes.nome,
      // pontuacao: sql<number>`COALESCE(${redis}.zscore('referencia:ranking', ${inscricoes.id}), 0)`
    })
    .from(inscricoes)
    .where(
      inArray(
        inscricoes.id,
        ranking.map(r => r.id)
      )
    ) // IDs do ranking

  // combinar os dados do Redis com os dados do banco de dados
  // a ordenação é feita com base no 'ranking' que veio do redis
  const rankingComPontuacao = ranking.map(rankItem => {
    const inscrito = inscritos.find(i => i.id === rankItem.id)
    // se o inscrito não for encontrado
    return {
      id: rankItem.id,
      nome: inscrito ? inscrito.nome : 'Nome não encontrado', // trata caso o inscrito não seja encontrado
      pontuacao: rankItem.pontuacao, // pega a pontuação que já veio do Redis
    }
  })

  return { rankingComPontuacao }
}
