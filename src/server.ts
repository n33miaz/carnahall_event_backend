import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify, type FastifyPluginAsync } from "fastify";
import {
	type ZodTypeProvider,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { clicksDeConviteRoute } from "./routes/clicks_de_convite-route";
import { contagemDeConvitesRoute } from "./routes/contagem_de_convites_route";
import { inscricaoParaOEventoRoute } from "./routes/inscricao_para_o_evento_route";
import { linkAcessoConviteRoute } from "./routes/link_acesso_convite_route";
import { posicaoInscritoRankingRoute } from "./routes/posicao_inscrito_ranking_route";
import { rankingRoute } from "./routes/ranking_route";

const app = fastify({
	logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler); // faz a serialização dos dados
app.setValidatorCompiler(validatorCompiler); // valida o formato de entrada de dados

app.register(fastifyCors, { // restringe as aquisições para um frontend específico
	origin: 'https://carnahall-event-frontend.vercel.app/'
});

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "CarnaHall", // evento de carnaval + dancehall
			version: "0.0.1",
		},
	},
	transform: jsonSchemaTransform,
	// faz a documentação automática sobre a serialização e a validação './routes/inscricao-para-o-evento-route'
});

// rota da documentação 'http://localhost:3333/docs'
app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

const healthRoute: FastifyPluginAsync = async (app) => {
	app.get('/health', async (request, reply) => {
	  return { status: 'ok' }
	})
  }
export default healthRoute

// registro das rotas na aplicação
app.register(inscricaoParaOEventoRoute);
app.register(linkAcessoConviteRoute);
app.register(clicksDeConviteRoute);
app.register(contagemDeConvitesRoute);
app.register(posicaoInscritoRankingRoute);
app.register(rankingRoute);

app.register(healthRoute);

app.listen({ port: env.PORT }).then(() => {
	// reportar 'quando' acontecer algo
	console.log("HTTP server rodando");
});