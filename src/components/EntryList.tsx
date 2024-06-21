"use client";
import React, { ChangeEvent } from 'react';

type EntryType = {
  _id?: string;
  date: string;
  category: string;
  hours: number;
  remarks?: string;
  user: number;
};

type EntryListProps = {
  entriesByDate: { [key: string]: EntryType[] };
  handleEditEntry: (entry: EntryType) => void;
  handleDeleteEntry: (entry: EntryType) => void;
  showMonthlyEntries: boolean;
  remarksByDate: { [key: string]: string };
  handleRemarksChange: (e: ChangeEvent<HTMLTextAreaElement>, date: string) => void;
  saveRemarks: (date: string) => void;
};

const EntryList: React.FC<EntryListProps> = ({
  entriesByDate,
  handleEditEntry,
  handleDeleteEntry,
  showMonthlyEntries,
  remarksByDate,
  handleRemarksChange,
  saveRemarks
}) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  const sortedDates = Object.keys(entriesByDate).sort();

  const calculateTotalHours = () => {
    let total = 0;
    sortedDates.forEach((date) => {
      entriesByDate[date].forEach((entry) => {
        total += entry.hours;
      });
    });
    return total;
  };

  return (
    <div>
      {sortedDates.length === 0 ? (
        <p>Keine Einträge für diesen Zeitraum.</p>
      ) : (
        sortedDates.map((date) => (
          <div key={date} className="mb-4">
            <h3 className="text-lg font-bold mb-2">Einträge vom {formatDate(date)}</h3>
            <ul>
              {entriesByDate[date].map((entry) => (
                <li key={entry._id || `${date}-${entry.category}`} className="border p-2 my-2 relative">
                  <div className="absolute top-2 right-2">
                    <i
                      className="fas fa-edit text-black text-2xl cursor-pointer"
                      onClick={() => handleEditEntry(entry)}
                    ></i>
                  </div>
                  <div>
                    <div>
                      <strong>Kategorie:</strong> {entry.category}
                    </div>
                    <div>
                      <strong>Stunden:</strong> {entry.hours}
                    </div>
                    <div className="mt-2">
                      <i
                        className="fas fa-trash text-black text-sm cursor-pointer"
                        onClick={() => handleDeleteEntry(entry)}
                      ></i>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div>
              <strong>Bemerkungen:</strong>
              <textarea
                value={remarksByDate[date] || ''}
                onChange={(e) => handleRemarksChange(e, date)}
                rows={3}
                className="mt-1 block w-full"
                placeholder="Bemerkungen"
              />
              <button onClick={() => saveRemarks(date)} className="bg-blue-500 text-white py-1 px-3 rounded mt-2">
                Speichern
              </button>
            </div>
            <div className="font-bold mt-2">Total Stunden am {formatDate(date)}: {entriesByDate[date].reduce((sum, entry) => sum + entry.hours, 0)}</div>
          </div>
        ))
      )}
      {showMonthlyEntries && (
        <div className="font-bold text-xl mt-4">Monatstotal Stunden: {calculateTotalHours()}</div>
      )}
    </div>
  );
};

export default EntryList;
