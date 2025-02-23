import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { contagemDeConvites } from "../functions/contagem-de-convites";

export const contagemDeConvitesRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/inscritos/:inscritoId/ranking/contagem",
		{
			schema: {
				summary: "Contagem de convites",
				tags: ["referência"],
				params: z.object({
					inscritoId: z.string(),
				}),
				response: {
					200: z.object({
						contagem: z.number(),
					}),
				},
			},
		},
		async (request) => {
			const { inscritoId } = request.params;

			const { contagem } = await contagemDeConvites({ inscritoId });

			return { contagem };
		},
	);
};
