import { useState, useCallback } from 'react';
import type { WeeklyCalendarData, CalendarEvent } from '../types/calendar';
import { calendarApi } from '../api/calendarApi';

// Функция для получения дат текущей недели
function getCurrentWeekDates(): { 
  year: number; 
  month: string;
  weekStart: Date; 
  weekEnd: Date; 
} {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.toLocaleString('default', { month: 'long' });
  
  // Получаем начало недели (понедельник)
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToMonday);
  weekStart.setHours(0, 0, 0, 0);
  
  // Получаем конец недели (воскресенье)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { year, month, weekStart, weekEnd };
}

export const useCalendar = () => {
  const [calendarData, setCalendarData] = useState<WeeklyCalendarData>(() => {
    const weekDates = getCurrentWeekDates();
    return {
      ...weekDates,
      events: []
    };
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await calendarApi.getWeeklyCalendar();
      setCalendarData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback(async (day: string) => {
    try {
      // Создаем объект с ВСЕМИ полями, кроме id
      const now = new Date();
      const eventData: Omit<CalendarEvent, 'id'> = {
        title: 'New Event',
        day: day as CalendarEvent['day'],
        time: '12:00',
        createdAt: now,
        updatedAt: now
      };
      
      const newEvent = await calendarApi.createEvent(eventData);
      
      setCalendarData(prev => ({
        ...prev,
        events: [...prev.events, newEvent]
      }));
      return newEvent;
    } catch (err) {
      console.error('Error adding event:', err);
      throw err;
    }
  }, []);

  const updateEvent = useCallback(async (eventId: string, updates: Partial<CalendarEvent>) => {
    try {
      // Фильтруем технические поля для обновления
      const { id, createdAt, updatedAt, ...updateFields } = updates as any;
      
      // Добавляем updatedAt при обновлении
      const updateData = {
        ...updateFields,
        updatedAt: new Date()
      };
      
      await calendarApi.updateEvent(eventId, updateData);
      
      setCalendarData(prev => ({
        ...prev,
        events: prev.events.map(event => 
          event.id === eventId ? { 
            ...event, 
            ...updateFields,
            updatedAt: new Date()
          } : event
        )
      }));
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  }, []);

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      await calendarApi.deleteEvent(eventId);
      setCalendarData(prev => ({
        ...prev,
        events: prev.events.filter(event => event.id !== eventId)
      }));
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  }, []);

  // Функция для навигации по неделям
  const navigateWeek = useCallback(async (direction: 'prev' | 'next' | 'current') => {
    setLoading(true);
    
    try {
      const { weekStart } = calendarData;
      const newWeekStart = new Date(weekStart);
      
      if (direction === 'prev') {
        newWeekStart.setDate(weekStart.getDate() - 7);
      } else if (direction === 'next') {
        newWeekStart.setDate(weekStart.getDate() + 7);
      } else {
        // Текущая неделя
        return fetchCalendarData();
      }
      
      // Загружаем данные для новой недели
      const data = await calendarApi.getWeeklyCalendar(newWeekStart);
      setCalendarData(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to navigate week');
    } finally {
      setLoading(false);
    }
  }, [calendarData, fetchCalendarData]);

  return {
    calendarData,
    loading,
    error,
    fetchCalendarData,
    addEvent,
    updateEvent,
    deleteEvent,
    navigateWeek
  };
};
