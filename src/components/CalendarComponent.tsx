import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';

type CalendarComponentProps = {
  onDateClick: (date: Date) => void;
  onActiveStartDateChange: (view: { activeStartDate: Date | null }) => void;
};

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateClick, onActiveStartDateChange }) => {
  const formatMonthYear = (date: Date) => {
    return format(date, 'MMMM yyyy', { locale: de });
  };

  return (
    <Calendar
      onClickDay={onDateClick}
      onActiveStartDateChange={({ activeStartDate }) => {
        if (activeStartDate) {
          onActiveStartDateChange({ activeStartDate });
        }
      }}
      locale="de"
      formatMonthYear={(locale, date) => formatMonthYear(date)}
    />
  );
};

export default CalendarComponent;
