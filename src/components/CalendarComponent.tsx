"use client";
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { setDefaultOptions } from 'date-fns';

setDefaultOptions({ locale: de });

type CalendarComponentProps = {
  onDateClick: (date: Date) => void;
};

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateClick }) => {
  const [value, setValue] = useState(new Date());

  const handleDateChange = (date: Date) => {
    setValue(date);
    onDateClick(date);
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={value}
        nextLabel=">"
        prevLabel="<"
        next2Label=">>"
        prev2Label="<<"
        showNeighboringMonth={false}
        locale="de-DE"  // Verwenden Sie den entsprechenden Locale-String
      />
    </div>
  );
};

export default CalendarComponent;
