export interface CalendarEvent {
  id: string;
  title: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time?: string | undefined;
  description?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyCalendarData {
  year: number;
  month: string;
  weekNumber: number;
  weekStart: Date;
  weekEnd: Date;
  events: CalendarEvent[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | undefined;
}

// Типы для запросов
export interface CreateEventRequest {
  title: string;
  day: CalendarEvent['day'];
  time?: string;
  description?: string;
}

export interface UpdateEventRequest {
  title?: string;
  day?: CalendarEvent['day'];
  time?: string;
  description?: string;
}
