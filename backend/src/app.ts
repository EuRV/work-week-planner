import Fastify from 'fastify'
import type { FastifyInstance, FastifyServerOptions, FastifyError } from 'fastify'
import { config } from 'dotenv'

import routes from './routes/index.js'

config()

// Кастомный тип ошибки
interface AppError extends FastifyError {
  statusCode?: number
  message: string
}

const isDev = process.env.NODE_ENV === 'development'

const buildApp = async (options: FastifyServerOptions = {}): Promise<FastifyInstance> => {
  const fastifyOptions: FastifyServerOptions = {
    ...options
  }

  // Настройка логгера
  if (isDev) {
    // Для разработки
    fastifyOptions.logger = {
      level: 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
          colorize: true
        }
      }
    }
  } else {
    // Для production
    fastifyOptions.logger = {
      level: 'info'
    }
  }

  // Создаем экземпляр
  const fastify = Fastify(fastifyOptions)

  // Регистрируем роуты
  await fastify.register(routes, { prefix: '/api' })

  // Обработка ошибок
  fastify.setErrorHandler((error: AppError, request, reply) => {
    const statusCode = error.statusCode || 500
    reply.status(statusCode).send({
      error: {
        message: error.message,
        statusCode
      }
    })
  })

  return fastify
}

export default buildApp
