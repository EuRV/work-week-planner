import { useState } from 'react';
import type { CalendarEvent } from '../types/calendar';
import { CalendarEventItem } from './CalendarEventItem';
import { AddButton } from './ui/Button';

interface DayColumnProps {
  day: string;
  events: CalendarEvent[];
  onAddEvent: (day: string) => Promise<CalendarEvent>;
  onUpdateEvent: (eventId: string, updates: Partial<CalendarEvent>) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
}

export function DayColumn({ 
  day, 
  events, 
  onAddEvent, 
  onUpdateEvent,
  onDeleteEvent 
}: DayColumnProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddEvent = async () => {
    setIsAdding(true);
    try {
      await onAddEvent(day);
    } catch (err) {
      console.error('Failed to add event:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <h3 className="font-bold text-lg text-gray-800 mb-4 text-center sticky top-0 bg-white/90 py-2 rounded-lg z-10">
        {day}
      </h3>
      
      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        <div className="space-y-3">
          {events.length > 0 ? (
            events.map(event => (
              <CalendarEventItem
                key={event.id}
                event={event}
                onUpdate={onUpdateEvent}
                onDelete={onDeleteEvent}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-8 h-full flex items-center justify-center min-h-50">
              <div>
                <div className="text-4xl mb-2">📅</div>
                <p className="text-sm">No events</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <AddButton
        onClick={handleAddEvent}
        disabled={isAdding}
        loading={isAdding}
      />
    </div>
  );
}
