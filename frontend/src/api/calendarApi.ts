import axios from 'axios';
import type { 
  WeeklyCalendarData, 
  CalendarEvent, 
  ApiResponse 
} from '../types/calendar';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const calendarApi = {
  async getWeeklyCalendar(weekStart?: Date): Promise<WeeklyCalendarData> {
    const params: any = {};
    if (weekStart) {
      params.weekStart = weekStart.toISOString();
    }
    
    const response = await axios.get<ApiResponse<WeeklyCalendarData>>(
      `${API_BASE_URL}/calendar/weekly`,
      { params }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch calendar data');
    }
    return response.data.data;
  },

  // Измените тип параметра на Omit<CalendarEvent, 'id'>
  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const response = await axios.post<ApiResponse<CalendarEvent>>(
      `${API_BASE_URL}/calendar/events`,
      event
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create event');
    }
    return response.data.data;
  },

  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<void> {
    const response = await axios.patch<ApiResponse<void>>(
      `${API_BASE_URL}/calendar/events/${eventId}`,
      updates
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update event');
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    const response = await axios.delete<ApiResponse<void>>(
      `${API_BASE_URL}/calendar/events/${eventId}`
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete event');
    }
  }
};
