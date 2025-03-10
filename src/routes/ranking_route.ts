import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ranking } from '../functions/ranking'

export const rankingRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/ranking',
    {
      schema: {
        summary: 'Ranking',
        tags: ['referência'],
        response: {
          200: z.object({
            ranking: z.array(
              z.object({
                id: z.string(),
                nome: z.string(),
                pontuacao: z.number(),
              })
            ),
          }),
        },
      },
    },
    async request => {
      try {
        const { rankingComPontuacao } = await ranking()

        return { ranking: rankingComPontuacao }
      } catch (error) {
        console.log(error)
      }
    }
  )
}
