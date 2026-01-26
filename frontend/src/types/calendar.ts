export interface CalendarEvent {
  id: string;
  title: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyCalendarData {
  year: number;
  month: string;
  weekStart: Date;
  weekEnd: Date;
  events: CalendarEvent[];
}

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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const;
