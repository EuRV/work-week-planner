import type { FastifyInstance, FastifyPluginAsync } from "fastify"

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get('/', async () => {
    return { message: 'Hello Fastify!' }
  })
}

export default routes
