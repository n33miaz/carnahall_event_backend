import { FastifyInstance } from 'fastify'

async function homeRoute(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    return { message: 'API is running!' }
  })
}

export default homeRoute