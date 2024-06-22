"use client";
import React, { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
            <ul className="mx-[-16px]"> {/* Negative margin to make the ul stretch to the edges */}
              {entriesByDate[date].map((entry) => (
                <li key={entry._id || `${date}-${entry.category}`} className="border p-2 my-2 relative bg-white w-full">
                  <div className="absolute top-2 right-2">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-black text-2xl cursor-pointer"
                      onClick={() => {
                        console.log('Edit icon clicked for entry:', entry);
                        handleEditEntry(entry);
                      }}
                    />
                  </div>
                  <div>
                    <div>
                      <strong>Kategorie:</strong> {entry.category}
                    </div>
                    <div>
                      <strong>Stunden:</strong> {entry.hours}
                    </div>
                    <div className="mt-2">
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-black text-sm cursor-pointer"
                        onClick={() => {
                          console.log('Delete icon clicked for entry:', entry);
                          handleDeleteEntry(entry);
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mx-[-16px] bg-white p-2"> {/* Same styling as li elements */}
              <strong>Bemerkung:</strong>
              <textarea
                value={remarksByDate[date] || ''}
                onChange={(e) => handleRemarksChange(e, date)}
                rows={3}
                className="mt-1 block w-full border border-gray-300"
                placeholder="Bemerkungen"
              />
              <button onClick={() => saveRemarks(date)} className="bg-black text-white py-1 px-3 rounded mt-2">
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
