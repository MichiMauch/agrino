"use client";
import React, { useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';

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
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [currentRemarksDate, setCurrentRemarksDate] = useState<string | null>(null);

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

  const openRemarksModal = (date: string) => {
    setCurrentRemarksDate(date);
    setShowRemarksModal(true);
  };

  const closeRemarksModal = () => {
    setShowRemarksModal(false);
    setCurrentRemarksDate(null);
  };

  const handleSaveRemarks = () => {
    if (currentRemarksDate) {
      saveRemarks(currentRemarksDate);
      closeRemarksModal();
    }
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
                <li key={entry._id || `${date}-${entry.category}`} className="border p-2 my-2 relative bg-gray-200 w-full">
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
            <div className="mx-[-16px] bg-white p-2">
              <strong>Bemerkung:</strong>
              <p>{remarksByDate[date] || 'Keine Bemerkung'}</p>
              <button
                onClick={() => openRemarksModal(date)}
                className="bg-customYellow-200 text-black py-1 px-3 rounded mt-2"
              >
                <FontAwesomeIcon icon={faEdit} className="text-2xl" />
              </button>
            </div>
          </div>
        ))
      )}
      {showMonthlyEntries && (
        <div className="font-bold text-xl mt-4">Monatstotal Stunden: {calculateTotalHours()}</div>
      )}
      {showRemarksModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg">
            <h2 className="text-xl mb-4">Bemerkung bearbeiten</h2>
            <textarea
              value={remarksByDate[currentRemarksDate!] || ''}
              onChange={(e) => handleRemarksChange(e, currentRemarksDate!)}
              rows={3}
              className="mt-1 block w-full border border-gray-300"
              placeholder="Bemerkungen"
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={closeRemarksModal}
                className="bg-red-500 text-white py-1 px-3 rounded"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSaveRemarks}
                className="bg-customYellow-200 text-black py-1 px-3 rounded"
              >
                <FontAwesomeIcon icon={faSave} className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryList;
