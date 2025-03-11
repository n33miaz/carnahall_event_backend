import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { type FastifyPluginAsync, fastify } from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { clicksDeConviteRoute } from './routes/clicks_de_convite-route'
import { contagemDeConvitesRoute } from './routes/contagem_de_convites_route'
import homeRoute from './routes/home_route'
import { inscricaoParaOEventoRoute } from './routes/inscricao_para_o_evento_route'
import { linkAcessoConviteRoute } from './routes/link_acesso_convite_route'
import { posicaoInscritoRankingRoute } from './routes/posicao_inscrito_ranking_route'
import { rankingRoute } from './routes/ranking_route'

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler) // faz a serialização dos dados
app.setValidatorCompiler(validatorCompiler) // valida o formato de entrada de dados

app.register(fastifyCors, {
  origin: 'https://carnahall.vercel.app', // 'true' 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],     
  exposedHeaders: ['X-Total-Count'],                     
  credentials: true,                                     
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Carnahall', // evento de carnaval + dancehall
      version: '0.0.1',
    },
  },
  transform: jsonSchemaTransform,
  // faz a documentação automática sobre a serialização e a validação './routes/inscricao-para-o-evento-route'
})

// middleware de tratamento de erros global
app.setErrorHandler((error, request, reply) => {
  console.error(error) // SEMPRE logar o erro

  if (error instanceof Error) {
    // se for um erro lançado intencionalmente
    reply.status(400).send({ error: error.message }) // ou outro status apropriado
  } else {
    // erros inesperados
    reply.status(500).send({ error: 'Erro interno do servidor.' })
  }
})

// rota da documentação 'http://localhost:3333/docs'
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

const healthRoute: FastifyPluginAsync = async app => {
  app.get('/health', async (request, reply) => {
    return { status: 'ok' }
  })
}
export default healthRoute

// registro das rotas na aplicação
app.register(healthRoute)
app.register(inscricaoParaOEventoRoute)
app.register(linkAcessoConviteRoute)
app.register(clicksDeConviteRoute)
app.register(contagemDeConvitesRoute)
app.register(posicaoInscritoRankingRoute)
app.register(rankingRoute)

app.register(homeRoute)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  // reportar 'quando' acontecer algo
  console.log('HTTP server rodando!')
})
