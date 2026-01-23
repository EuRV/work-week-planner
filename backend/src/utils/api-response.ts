import type { FastifyReply } from 'fastify'
import type { ApiResponse } from '../types/api.js'

export function sendSuccess<T>(reply: FastifyReply, data: T, message?: string) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  }

  return reply.code(200).send(response)
}

export function sendError(reply: FastifyReply, statusCode: number, message: string) {
  const response: ApiResponse<null> = {
    success: false,
    data: null,
    message
  }

  return reply.code(statusCode).send(response)
}
