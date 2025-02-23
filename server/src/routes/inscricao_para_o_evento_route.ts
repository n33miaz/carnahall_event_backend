import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { inscricaoNoEvento } from "../functions/inscricao-no-evento";

export const inscricaoParaOEventoRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/inscricoes",
		{
			schema: {
				summary: "Inscreve alguém para o evento",
				tags: ["Inscrição"],
				body: z.object({
					nome: z.string(),
					email: z.string().email(),
					referencia: z.string().nullish(),
				}),
				response: {
					201: z.object({
						inscritoId: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { nome, email, referencia } = request.body;

			const { inscritoId } = await inscricaoNoEvento({
				nome,
				email,
				referenciadorId: referencia || null,
			});

			// criação da inscrição no banco de dados
			return reply.status(201).send({
				inscritoId,
			});
		},
	);
};
