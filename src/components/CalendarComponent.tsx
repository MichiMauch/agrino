import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type CalendarComponentProps = {
  onDateClick: (date: Date) => void;
  onActiveStartDateChange: ({ activeStartDate }: { activeStartDate: Date | null }) => void;
  entriesByDate: { [key: string]: number };
  locale: string;
};

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateClick, onActiveStartDateChange, entriesByDate, locale }) => {
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    const dateString = format(date, 'yyyy-MM-dd');
    if (view === 'month') {
      const hours = entriesByDate[dateString] || 0;
      return (
        <div className="flex flex-col items-center">
          {hours > 0 ? (
            <span className="text-sm text-blue-500">{hours}h</span>
          ) : (
            <span className="invisible text-sm">0h</span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full sm:w-auto">
      <Calendar
        onClickDay={onDateClick}
        onActiveStartDateChange={onActiveStartDateChange}
        tileContent={tileContent}
        locale={locale} // Locale hinzufügen
      />
    </div>
  );
};

export default CalendarComponent;
