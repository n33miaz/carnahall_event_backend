import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { inscricaoNoEvento } from '../functions/inscricao-no-evento';

export const inscricaoParaOEventoRoute: FastifyPluginAsyncZod = async app => {
    app.post('/inscricoes', {
        schema: {
            summary: 'Inscreve alguém para o evento',
            tags: ['Inscrição'],
            body: z.object({ 
                nome: z.string(),
                email: z.string().email(),
            }),
            response: {
                201: z.object({
                    inscritoId: z.string(),
                })
            }
        },
    }, async (request, reply) => {
        const { nome, email } = request.body 

        const { inscritoId } = await inscricaoNoEvento({
            nome,
            email,
        });
    
        // criação da inscrição no banco de dados
        return reply.status(201).send({
            inscritoId
        });
    });
};