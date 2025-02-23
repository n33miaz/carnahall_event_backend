import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { env } from "../env";
import { linkAcessoConvite } from "../functions/link_acesso_convite";

export const linkAcessoConviteRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/convites/:inscritoId",
		{
			schema: {
				summary: "Link de convite e redirecionamento do usuário",
				tags: ["referência"],
				params: z.object({
					inscritoId: z.string(),
				}),
				response: {
					302: z.null(),
				},
			},
		},
		async (request, reply) => {
			const { inscritoId } = request.params;

			// chama a função que incrementa a contagem no Redis
			await linkAcessoConvite({ inscritoId });

			// serve para diferenciar de quem foi a indicação do link/convite
			const redirecionamentoUrl = new URL(env.WEB_URL);
			redirecionamentoUrl.searchParams.set("referenciador", inscritoId);

			// 302: redirect temporário (contabilizar mais de 1 acesso)
			return reply.redirect(redirecionamentoUrl.toString(), 302);
		},
	);
};