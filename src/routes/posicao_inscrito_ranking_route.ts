import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { posicaoInscritoRanking } from "../functions/posicao_inscrito_ranking";

export const posicaoInscritoRankingRoute: FastifyPluginAsyncZod = async (
	app,
) => {
	app.get(
		"/inscritos/:inscritoId/ranking/posicao",
		{
			schema: {
				summary: "Posição no ranking do inscrito",
				tags: ["referência"],
				params: z.object({
					inscritoId: z.string(),
				}),
				response: {
					200: z.object({
						position: z.number().nullable(),
					}),
				},
			},
		},
		async (request) => {
			const { inscritoId } = request.params;

			const { position } = await posicaoInscritoRanking({ inscritoId });

			return { position };
		},
	);
};
