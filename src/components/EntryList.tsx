"use client";
import React, { useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import EntryForm from './EntryForm';
import RemarksForm from './RemarksForm';
import { categories } from './CategorySelect';

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
  handleAddEntry: () => void;
  handleUpdateEntry: () => void;
  deleteRemarks: (date: string) => void;
};

const EntryList: React.FC<EntryListProps> = ({
  entriesByDate,
  handleEditEntry,
  handleDeleteEntry,
  showMonthlyEntries,
  remarksByDate,
  handleRemarksChange,
  saveRemarks,
  handleAddEntry,
  handleUpdateEntry,
  deleteRemarks,
}) => {
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [currentRemarksDate, setCurrentRemarksDate] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  const getCategoryLabel = (value: string) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  const sortedDates = Object.keys(entriesByDate).sort();

  const calculateTotalHours = (date: string) => {
    return entriesByDate[date]?.reduce((sum, entry) => sum + entry.hours, 0) || 0;
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

  const handleDeleteRemarks = () => {
    if (currentRemarksDate) {
      deleteRemarks(currentRemarksDate);
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
            <div className="w-screen bg-customYellow-400 text-white text-center text-2xl font-bold my-4 mx-[-16px] py-2">
              {formatDate(date)} - {calculateTotalHours(date)}h
            </div>
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
                      <strong>Kategorie:</strong> {getCategoryLabel(entry.category)}
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
            <div className="mx-[-16px] bg-white p-2 relative pb-8"> {/* Added pb-8 to add padding at the bottom */}
              <div className="absolute top-2 right-2">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-black text-2xl cursor-pointer"
                  onClick={() => openRemarksModal(date)}
                />
              </div>
              <strong>Bemerkung:</strong>
              <p className="mr-8">{remarksByDate[date] || 'Keine Bemerkung'}</p>
              <div className="absolute bottom-2 left-2">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-black text-sm cursor-pointer"
                  onClick={() => deleteRemarks(date)}
                />
              </div>
            </div>
          </div>
        ))
      )}
      {showMonthlyEntries && (
        <div className="font-bold text-xl mt-4">Monatstotal Stunden: {calculateTotalHours(Object.keys(entriesByDate).join(","))}</div>
      )}
      {showRemarksModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg relative">
            <button
              type="button"
              onClick={closeRemarksModal}
              className="absolute top-2 right-2 text-black text-xl"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-xl mb-4">Bemerkung bearbeiten</h2>
            <RemarksForm
              remarks={remarksByDate[currentRemarksDate!] || ''}
              onRemarksChange={(e) => handleRemarksChange(e, currentRemarksDate!)}
              saveRemarks={handleSaveRemarks}
              onCancel={closeRemarksModal}
              deleteRemarks={handleDeleteRemarks} // Pass deleteRemarks function
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryList;
