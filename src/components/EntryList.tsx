"use client";
import React from 'react';

type EntryType = {
  _id?: string;
  date: string;
  category: string;
  hours: number;
  user: number;
};

type EntryListProps = {
  entriesByDate: { [key: string]: EntryType[] };
  handleEditEntry: (entry: EntryType) => void;
  handleDeleteEntry: (entry: EntryType) => void;
  showMonthlyEntries: boolean; // Hinzufügen eines Flags, um die Ansicht zu unterscheiden
};

const EntryList: React.FC<EntryListProps> = ({ entriesByDate, handleEditEntry, handleDeleteEntry, showMonthlyEntries }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  const sortedDates = Object.keys(entriesByDate).sort();

  // Berechnung des Totals
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
                <li key={entry._id || `${date}-${entry.category}`} className="border p-2 my-2">
                  <div>
                    <strong>Kategorie:</strong> {entry.category}
                  </div>
                  <div>
                    <strong>Stunden:</strong> {entry.hours}
                  </div>
                  <button onClick={() => handleEditEntry(entry)} className="bg-yellow-500 text-white py-1 px-3 rounded mt-2">
                    Bearbeiten
                  </button>
                  <button onClick={() => handleDeleteEntry(entry)} className="bg-red-500 text-white py-1 px-3 rounded mt-2 ml-2">
                    Löschen
                  </button>
                </li>
              ))}
            </ul>
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
