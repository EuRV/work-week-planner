export function CalendarLoading() {
  return (
    <div className="flex justify-center items-center min-h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-lg text-gray-600">Loading calendar data...</div>
      </div>
    </div>
  );
}
