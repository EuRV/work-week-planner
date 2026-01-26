import { useEffect } from 'react';
import { DAYS_OF_WEEK } from '../types/calendar';
import { useCalendar } from '../hooks/useCalendar';
import { CalendarHeader } from './CalendarHeader';
import { DayColumn } from './DayColumn';
import { CalendarError } from './CalendarError';
import { CalendarLoading } from './CalendarLoading';

export function WeeklyCalendar() {
  const {
    calendarData,
    loading,
    error,
    fetchCalendarData,
    addEvent,
    updateEvent,
    deleteEvent,
    navigateWeek
  } = useCalendar();

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-blue-50">
        <CalendarLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-4">
        <CalendarError error={error} onRetry={fetchCalendarData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-screen-2xl mx-auto h-full flex flex-col">
        <CalendarHeader
          year={calendarData.year}
          month={calendarData.month}
          weekStart={calendarData.weekStart}
          weekEnd={calendarData.weekEnd}
          totalEvents={calendarData.events.length}
          onRefresh={fetchCalendarData}
          onNavigate={navigateWeek}
          refreshing={loading}
        />

        <div className="flex-1 grid grid-cols-1 md:grid-cols-7 gap-3 md:gap-4 min-h-0">
          {DAYS_OF_WEEK.map(day => (
            <DayColumn
              key={day}
              day={day}
              events={calendarData.events.filter(event => event.day === day)}
              onAddEvent={addEvent}
              onUpdateEvent={updateEvent}
              onDeleteEvent={deleteEvent}
            />
          ))}
        </div>

        <footer className="mt-4 pt-4 border-t border-gray-200/50">
          <div className="text-center text-sm text-gray-500">
            🦐 Weekly Planner Template • {calendarData.events.length} events
          </div>
        </footer>
      </div>
    </div>
  );
}
