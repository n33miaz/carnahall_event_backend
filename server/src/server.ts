import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import {
    type ZodTypeProvider,
    validatorCompiler, 
    serializerCompiler,
    jsonSchemaTransform
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { inscricaoParaOEventoRoute } from './routes/inscricao-para-o-evento-route'
import { env } from './env'
import { linkAcessoConviteRoute } from './routes/link_acesso_convite-route'
import { clicksDeConviteRoute } from './routes/clicks_de_convite-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler); // faz a serialização dos dados
app.setValidatorCompiler(validatorCompiler); // valida o formato de entrada de dados

app.register(fastifyCors, { // restringe as aquisições para um frontend específico
    origin: true, // ex: 'http://localhost:3333'
});

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'CarnaHall', // evento de carnaval + dancehall
            version: '0.0.1',  
        },
    },
    transform: jsonSchemaTransform, 
    // faz a documentação automática sobre a serialização e a validação './routes/inscricao-para-o-evento-route'
});

// rota da documentação 'http://localhost:3333/docs'
app.register(fastifySwaggerUi, { 
    routePrefix: '/docs',
});

app.register(inscricaoParaOEventoRoute);
app.register(linkAcessoConviteRoute);
app.register(clicksDeConviteRoute);

app.listen({ port: env.PORT }).then(() => { // reportar 'quando' acontecer algo
    console.log("HTTP server rodando") 
});