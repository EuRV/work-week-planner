import Fastify from 'fastify'
import cors from '@fastify/cors'
import type { FastifyInstance, FastifyServerOptions, FastifyError } from 'fastify'

import { calendarRoutes } from './routes/calendar/index.js';

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

  // Регистрируем CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
  })

  // Регистрируем роуты
  await fastify.register(async (app) => {
    app.register(calendarRoutes);
  }, { prefix: '/api/calendar' })

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
