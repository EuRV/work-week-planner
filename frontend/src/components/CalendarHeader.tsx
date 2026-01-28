import { RefreshButton, TodayButton, PreviousWeekButton, NextWeekButton } from './ui/Button';

interface CalendarHeaderProps {
  year: number;
  month: string;
  weekStart: string | Date;
  weekEnd: string | Date;
  totalEvents: number;
  onRefresh: () => void;
  onNavigate: (direction: 'prev' | 'next' | 'current') => void;
  refreshing?: boolean;
}

export function CalendarHeader({
  year,
  month,
  weekStart,
  weekEnd,
  totalEvents,
  onRefresh,
  onNavigate,
  refreshing = false
}: CalendarHeaderProps) {
  // Функция для форматирования даты
  const formatDate = (date: string | Date) => {
    // Преобразуем в Date, если это строка
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Проверяем, что это валидная дата
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    return dateObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <header className="mb-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm sticky top-4 z-10 border border-gray-200/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2">
            Weekly Calendar
          </h1>

          <div className="flex items-center gap-2 text-lg text-gray-600">
            <span>{formatDate(weekStart)} - {formatDate(weekEnd)}</span>
            <span>•</span>
            <span>{month} {year}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PreviousWeekButton onClick={() => onNavigate('prev')} />
          <TodayButton onClick={() => onNavigate('current')} />
          <NextWeekButton onClick={() => onNavigate('next')} />
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <span className="font-semibold text-blue-700">Year:</span>
            <span className="text-lg text-blue-800 font-bold">{year}</span>
          </div>

          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
            <span className="font-semibold text-purple-700">Month:</span>
            <span className="text-lg text-purple-800 font-bold">{month}</span>
          </div>

          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
            <span className="font-semibold text-green-700">Events:</span>
            <span className="text-lg text-green-800 font-bold">{totalEvents}</span>
          </div>
        </div>

        <RefreshButton
          onClick={onRefresh}
          disabled={refreshing}
          loading={refreshing}
        />
      </div>
    </header>
  );
}
