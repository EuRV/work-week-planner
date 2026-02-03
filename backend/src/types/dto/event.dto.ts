import type { Event } from '../entities/event.entity.js';

// Запрос на создание события
export interface CreateEventDto {
  creatorId: string;
  executorId?: string;
  title: string;
  day: Event['day'];
  time?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: Event['priority'];
}

// Запрос на обновление события
export interface UpdateEventDto {
  executorId?: string;
  title?: string;
  day?: Event['day'];
  time?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: Event['priority'];
}

// Ответ с данными события
export type EventResponseDto = Event & {
  creator?: User;
  executor?: User;
};

// Ответ со списком событий
export interface EventsListResponseDto {
  events: EventResponseDto[];
  total: number;
  page: number;
  limit: number;
}

// Данные недельного календаря
export interface WeeklyCalendarDto {
  year: number;
  month: string;
  events: EventResponseDto[];
}

// Импортируем User для типизации
import type { User } from '../entities/user.entity.js'
