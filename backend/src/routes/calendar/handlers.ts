import type { FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { events } from '../../db/schema.js';
import { sendSuccess, sendError } from '../../utils/api-response.js';
import type {
  CreateEventRequest,
  UpdateEventRequest,
  CalendarEvent,
  WeeklyCalendarData
} from '../../types/api.js';

export class CalendarHandlers {
  // GET /api/calendar/weekly
  async getWeeklyCalendar(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { weekStart } = req.query as { weekStart?: string };

      let targetDate = new Date();
      if (weekStart) {
        targetDate = new Date(weekStart);
      }

      // Логика для получения дат недели
      const year = targetDate.getFullYear();
      const month = targetDate.toLocaleString('en-US', { month: 'long' });

      // Получаем начало недели (понедельник)
      const dayOfWeek = targetDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const weekStartDate = new Date(targetDate);
      weekStartDate.setDate(targetDate.getDate() - diffToMonday);
      weekStartDate.setHours(0, 0, 0, 0);

      // Получаем конец недели (воскресенье)
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      weekEndDate.setHours(23, 59, 59, 999);

      // Номер недели
      const weekNumber = this.getWeekNumber(targetDate);

      // Получаем события (в реальном приложении здесь был бы запрос с фильтрацией по дате)
      const allEvents = await db.select().from(events);

      const data: WeeklyCalendarData = {
        year,
        month,
        weekNumber,
        weekStart: weekStartDate,
        weekEnd: weekEndDate,
        events: allEvents.map(event => ({
          id: event.id,
          title: event.title,
          day: event.day as CalendarEvent['day'],
          time: event.time ?? undefined,
          description: event.description ?? undefined,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt
        }))
      };

      return sendSuccess(reply, data);
    } catch (error) {
      console.error('Error fetching calendar:', error);
      return sendError(reply, 500, 'Failed to fetch calendar data');
    }
  }

  // Метод для получения номера недели
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  // POST /api/calendar/events
  async createEvent(
    req: FastifyRequest<{ Body: CreateEventRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { title, day, time, description } = req.body;

      // Валидация
      if (!title || !title.trim()) {
        return sendError(reply, 400, 'Title is required');
      }

      if (!day) {
        return sendError(reply, 400, 'Day is required');
      }

      // Проверка формата времени
      if (time && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
        return sendError(reply, 400, 'Time must be in HH:MM format');
      }

      // Подготавливаем данные для вставки
      const insertData: any = {
        title: title.trim(),
        day,
      };

      // Добавляем опциональные поля
      if (time !== undefined) {
        insertData.time = time;
      }

      if (description !== undefined) {
        insertData.description = description.trim();
      }

      // Создаем событие и получаем результат
      const result = await db.insert(events).values(insertData).returning();
      const newEvent = result[0];

      if (!newEvent) {
        return sendError(reply, 500, 'Failed to create event');
      }

      // Создаем объект CalendarEvent
      const calendarEvent: CalendarEvent = {
        id: newEvent.id,
        title: newEvent.title,
        day: newEvent.day as CalendarEvent['day'],
        time: newEvent.time ?? undefined,
        description: newEvent.description ?? undefined,
        createdAt: newEvent.createdAt,
        updatedAt: newEvent.updatedAt
      };

      return sendSuccess(reply, calendarEvent, 'Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      return sendError(reply, 500, 'Failed to create event');
    }
  }

  // PATCH /api/calendar/events/:id
  async updateEvent(
    req: FastifyRequest<{
      Params: { id: string };
      Body: UpdateEventRequest;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Проверяем существование события
      const result = await db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);

      if (!result || result.length === 0) {
        return sendError(reply, 404, 'Event not found');
      }

      const existingEvent = result[0];

      // Валидация времени
      if (updates.time && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(updates.time)) {
        return sendError(reply, 400, 'Time must be in HH:MM format');
      }

      // Подготавливаем данные для обновления
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title.trim();
      if (updates.day !== undefined) updateData.day = updates.day;
      if (updates.time !== undefined) updateData.time = updates.time;
      if (updates.description !== undefined) updateData.description = updates.description.trim();

      // Обновляем только если есть изменения
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = new Date();

        await db
          .update(events)
          .set(updateData)
          .where(eq(events.id, id));
      }

      return sendSuccess(reply, null, 'Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      return sendError(reply, 500, 'Failed to update event');
    }
  }

  // DELETE /api/calendar/events/:id
  async deleteEvent(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;

      // Проверяем существование события
      const result = await db
        .select()
        .from(events)
        .where(eq(events.id, id))
        .limit(1);

      if (!result || result.length === 0) {
        return sendError(reply, 404, 'Event not found');
      }

      // Удаляем событие
      await db.delete(events).where(eq(events.id, id));

      return sendSuccess(reply, null, 'Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      return sendError(reply, 500, 'Failed to delete event');
    }
  }
}
