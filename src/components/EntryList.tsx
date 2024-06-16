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
  date: string;
  entries: EntryType[];
  handleEditEntry: (entry: EntryType) => void;
  handleDeleteEntry: (entry: EntryType) => void;
};

const EntryList: React.FC<EntryListProps> = ({ date, entries, handleEditEntry, handleDeleteEntry }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Einträge vom {formatDate(date)}</h2>
      {entries.length === 0 ? (
        <p>Keine Einträge für diesen Tag.</p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <li key={entry._id} className="border p-2 my-2">
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
      )}
    </div>
  );
};

export default EntryList;
