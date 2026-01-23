import type { FastifyInstance } from 'fastify'
import { CalendarHandlers } from './handlers.js'
import type { 
  CreateEventRequest, 
  UpdateEventRequest 
} from '../../types/api.js'

export async function calendarRoutes(fastify: FastifyInstance) {
  const handlers = new CalendarHandlers()
  
  // GET /api/calendar/weekly
  fastify.get('/weekly', handlers.getWeeklyCalendar.bind(handlers));
  
  // POST /api/calendar/events
  fastify.post<{ Body: CreateEventRequest }>(
    '/events',
    handlers.createEvent.bind(handlers)
  )
  
  // PATCH /api/calendar/events/:id
  fastify.patch<{ 
    Params: { id: string };
    Body: UpdateEventRequest;
  }>(
    '/events/:id',
    handlers.updateEvent.bind(handlers)
  )
  
  // DELETE /api/calendar/events/:id
  fastify.delete<{ Params: { id: string } }>(
    '/events/:id',
    handlers.deleteEvent.bind(handlers)
  )
}
