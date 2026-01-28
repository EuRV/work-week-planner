// components/CalendarEventItem.tsx
import { useState } from 'react';
import type { CalendarEvent } from '../types/calendar';

interface CalendarEventItemProps {
  event: CalendarEvent;
  onUpdate: (eventId: string, updates: Partial<CalendarEvent>) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
}

export function CalendarEventItem({ event, onUpdate, onDelete }: CalendarEventItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (title.trim() !== event.title && !isUpdating) {
      setIsUpdating(true);
      try {
        await onUpdate(event.id, { title: title.trim() });
      } catch (err) {
        console.error('Failed to update event:', err);
      } finally {
        setIsUpdating(false);
      }
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setIsDeleting(true);
      try {
        await onDelete(event.id);
      } catch (err) {
        console.error('Failed to delete event:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className={`bg-linear-to-r from-white to-gray-50 rounded-xl p-4 shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200 ${isUpdating ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-start gap-3">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="flex-1 px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
            autoFocus
            disabled={isUpdating}
          />
        ) : (
          <div 
            onClick={() => !isUpdating && setIsEditing(true)}
            className={`flex-1 ${isUpdating ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50/50'} p-2 rounded-lg transition-colors`}
          >
            <h4 className="font-semibold text-gray-800 text-lg mb-1">
              {event.title}
              {isUpdating && <span className="ml-2 text-xs text-blue-500 animate-pulse">(saving...)</span>}
            </h4>
          </div>
        )}
        
        <button
          onClick={handleDelete}
          disabled={isDeleting || isUpdating}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete event"
        >
          {isDeleting ? (
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></span>
          ) : (
            <span className="text-xl">🗑️</span>
          )}
        </button>
      </div>
      
      {event.time && (
        <div className="text-sm text-gray-600 mt-3 flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-lg w-fit">
          <span className="text-blue-500">🕐</span>
          <span className="font-medium">{event.time}</span>
        </div>
      )}
      
      {event.description && (
        <p className="text-gray-600 mt-3 text-sm bg-gray-50/50 p-3 rounded-lg border border-gray-200/30">
          {event.description}
        </p>
      )}
      
      <div className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-200/30">
        Created: {new Date(event.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
