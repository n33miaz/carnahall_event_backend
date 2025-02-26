import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { clicksDeConvite } from "../functions/clicks_de_convite";
import { z } from "zod";

export const clicksDeConviteRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/inscritos/:inscritoId/ranking/clicks",
		{
			schema: {
				summary: "Contagem de clicks de um convite",
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
			try 
			{
				const { inscritoId } = request.params;

				const { contagem } = await clicksDeConvite({ inscritoId });

				return { contagem };
			}
			catch (error)
			{
				console.error(error);
			}
		},
	);
};
