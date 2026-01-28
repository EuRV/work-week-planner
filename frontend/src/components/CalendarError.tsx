interface CalendarErrorProps {
  error: string;
  onRetry: () => void;
}

export function CalendarError({ error, onRetry }: CalendarErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
      <div className="flex items-start gap-3">
        <div className="text-red-500 text-xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-800 mb-1">Error Loading Calendar</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
