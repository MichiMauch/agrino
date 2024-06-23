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
  morningMeal?: boolean;
  lunchMeal?: boolean;
  eveningMeal?: boolean;
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
  handleMealChange: (date: string, meal: string, value: boolean) => void;
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
  handleMealChange,
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

  const calculateMonthlyTotalHours = (entriesByDate: { [key: string]: EntryType[] }) => {
    return Object.values(entriesByDate).flat().reduce((sum, entry) => sum + entry.hours, 0);
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

  const handleMealCheckboxChange = async (date: string, meal: string) => {
    const currentValue = entriesByDate[date]?.[0]?.[meal] || false;
    const newValue = !currentValue;
  
    handleMealChange(date, meal, newValue);
  
    try {
      const response = await fetch('/api/hours', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, meal, value: newValue }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (!data.success) {
        throw new Error('Error updating meal status');
      }
    } catch (error) {
      console.error('Error saving meal status:', error.message);
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
            
            {/* Neue Box für die Toggle-Schalter */}
            <div className="mx-[-16px] bg-white p-2 mt-4 relative pb-8">
              <div className="border p-2 mb-2"> {/* Box for meal checkboxes */}
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={entriesByDate[date]?.[0]?.morningMeal || false}
                    onChange={() => handleMealCheckboxChange(date, 'morningMeal')}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:bg-red-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Morgenessen</span>
                </label>
                <label className="inline-flex items-center me-5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={entriesByDate[date]?.[0]?.lunchMeal || false}
                    onChange={() => handleMealCheckboxChange(date, 'lunchMeal')}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:bg-red-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Mittagessen</span>
                </label>
                <label className="inline-flex items-center me-5 cursor-pointer">
                  <input 
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={entriesByDate[date]?.[0]?.eveningMeal || false}
                    onChange={() => handleMealCheckboxChange(date, 'eveningMeal')}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:bg-red-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Abendessen</span>
                </label>
              </div>
            </div>
            <div className="mx-[-16px] bg-white p-2 relative pb-8"> {/* Box for remarks */}
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
        <div className="font-bold text-xl mt-4">Monatstotal Stunden: {calculateMonthlyTotalHours(entriesByDate)}</div>
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
  