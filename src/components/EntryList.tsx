"use client";
import React, { useState, ChangeEvent } from 'react';

type EntryType = {
  _id?: string;
  date: string;
  category: string;
  hours: number;
  remarks: string;
  user: number;
};

type EntryListProps = {
  entriesByDate: { [key: string]: EntryType[] };
  handleEditEntry: (entry: EntryType) => void;
  handleDeleteEntry: (entry: EntryType) => void;
  handleSaveEntry: (entry: EntryType) => void;
  showMonthlyEntries: boolean; // Hinzufügen eines Flags, um die Ansicht zu unterscheiden
};

const EntryList: React.FC<EntryListProps> = ({ entriesByDate, handleEditEntry, handleDeleteEntry, handleSaveEntry, showMonthlyEntries }) => {
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Partial<EntryType>>({});

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  const sortedDates = Object.keys(entriesByDate).sort();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof EntryType) => {
    setEditingValues({ ...editingValues, [field]: e.target.value });
  };

  const handleSave = (entry: EntryType) => {
    const updatedEntry = { ...entry, ...editingValues };
    handleSaveEntry(updatedEntry);
    setEditingEntryId(null);
  };

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
                  {editingEntryId === entry._id ? (
                    <div>
                      <div>
                        <label className="block text-sm font-medium">Kategorie</label>
                        <input
                          type="text"
                          value={editingValues.category || entry.category}
                          onChange={(e) => handleChange(e, 'category')}
                          className="mt-1 block w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Stunden</label>
                        <input
                          type="number"
                          value={editingValues.hours !== undefined ? editingValues.hours : entry.hours}
                          onChange={(e) => handleChange(e, 'hours')}
                          className="mt-1 block w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Bemerkungen</label>
                        <textarea
                          value={editingValues.remarks || entry.remarks}
                          onChange={(e) => handleChange(e, 'remarks')}
                          className="mt-1 block w-full"
                          rows={3}
                        />
                      </div>
                      <button onClick={() => handleSave(entry)} className="bg-green-500 text-white py-1 px-3 rounded mt-2">
                        Speichern
                      </button>
                      <button onClick={() => setEditingEntryId(null)} className="bg-gray-500 text-white py-1 px-3 rounded mt-2 ml-2">
                        Abbrechen
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div>
                        <strong>Kategorie:</strong> {entry.category}
                      </div>
                      <div>
                        <strong>Stunden:</strong> {entry.hours}
                      </div>
                      <div>
                        <strong>Bemerkungen:</strong> {entry.remarks}
                      </div>
                      <button onClick={() => { handleEditEntry(entry); setEditingEntryId(entry._id || ''); setEditingValues(entry); }} className="bg-yellow-500 text-white py-1 px-3 rounded mt-2">
                        Bearbeiten
                      </button>
                      <button onClick={() => handleDeleteEntry(entry)} className="bg-red-500 text-white py-1 px-3 rounded mt-2 ml-2">
                        Löschen
                      </button>
                    </div>
                  )}
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
