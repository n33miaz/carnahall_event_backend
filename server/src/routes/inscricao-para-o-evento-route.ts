import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const inscricaoParaOEventoRoute: FastifyPluginAsyncZod = async (app) => {
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
                    nome: z.string(),
                    email: z.string()
                })
            }
        },
    }, async (request, reply) => {
        const { nome, email } = request.body 
    
        // criação da inscrição no banco de dados
        return reply.status(201).send({
            nome,
            email
        })
    });
};