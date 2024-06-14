import React from 'react';
import { format } from 'date-fns';

type EntryType = {
  _id?: string;
  date: string;
  category: string;
  hours: number;
};

type EntryListProps = {
  entriesByDate: { [key: string]: EntryType[] };
  onEditEntry: (entry: EntryType) => void;
  onDeleteEntry: (entry: EntryType) => void;
};

const EntryList: React.FC<EntryListProps> = ({ entriesByDate, onEditEntry, onDeleteEntry }) => {
  const sortedDates = Object.keys(entriesByDate).sort();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Einträge</h2>
      {sortedDates.map(date => (
        <div key={date}>
          <h3 className="text-lg font-bold">{formatDate(date)}</h3>
          <ul className="list-disc list-inside ml-4">
            {entriesByDate[date].map((entry, index) => (
              <li key={index} className="mb-1">
                <span className="font-medium">{entry.category}:</span> {entry.hours} Stunden
                <button 
                  className="ml-2 text-sm text-blue-500"
                  onClick={() => onEditEntry(entry)}
                >
                  Bearbeiten
                </button>
                <button 
                  className="ml-2 text-sm text-red-500"
                  onClick={() => onDeleteEntry(entry)}
                >
                  Löschen
                </button>
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-bold mt-2">Total: {entriesByDate[date].reduce((sum, entry) => sum + entry.hours, 0)} Stunden
          </h3>
          <hr className="my-4" />
        </div>
      ))}
    </div>
  );
};

export default EntryList;
