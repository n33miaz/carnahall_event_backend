import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { env } from '../env';
import { linkAcessoConvite } from '../functions/link_acesso_convite';
import { redis } from '../redis/client';
import { clicksDeConvite } from '../functions/clicks_de_convite';

export const clicksDeConviteRoute: FastifyPluginAsyncZod = async app => {
    app.get(
        '/inscritos/:inscritoId/ranking/clicks', 
    { 
        schema: {
            summary: 'Contagem de clicks de um convite',
            tags: ['referência'],
            params: z.object({ 
                inscritoId: z.string(),
            }),
            response: {
                200: z.object({
                    contagem: z.number(),
                })
            }
        },
    }, async (request) => {
        const { inscritoId } = request.params ;

        const { contagem } = await clicksDeConvite({ inscritoId });

        return { contagem };
    });
};