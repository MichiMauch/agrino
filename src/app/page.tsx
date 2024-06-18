"use client"
import { useState, useEffect, ChangeEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import CalendarComponent from '../components/CalendarComponent';
import users, { getUserById } from '../lib/users';
import ExportToExcel from '../components/ExportToExcel';

type HoursType = {
  [key: string]: number;
};

type EntryType = {
  _id?: string;
  date: string;
  category: string;
  hours: number;
  user: number;
};

export default function FillHours() {
  const searchParams = useSearchParams();
  const userId = parseInt(searchParams?.get('user') || '1');
  const user = getUserById(userId);
  const [date, setDate] = useState<string>('');
  const [hours, setHours] = useState<HoursType>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [entriesByDate, setEntriesByDate] = useState<{ [key: string]: EntryType[] }>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [editEntry, setEditEntry] = useState<EntryType | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [showMonthlyEntries, setShowMonthlyEntries] = useState<boolean>(false); // Zustand für die Monatsansicht

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);

    const fetchEntries = async () => {
      try {
        const response = await fetch(`/api/hours?user=${userId}`);
        const data = await response.json();
        if (data.success) {
          const entries = data.data;
          const entriesByDate = entries.reduce((acc: { [key: string]: EntryType[] }, entry: EntryType) => {
            const dateEntries = acc[entry.date] || [];
            dateEntries.push(entry);
            acc[entry.date] = dateEntries;
            return acc;
          }, {});
          setEntriesByDate(entriesByDate);
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, [userId]);

  const handleDateClick = (date: Date) => {
    const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    setDate(adjustedDate.toISOString().split('T')[0]);
    setShowMonthlyEntries(false); // Verberge die Monatsansicht, wenn ein einzelnes Datum ausgewählt wird
  };

  const handleMonthChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
    // Funktion kann entfernt werden, wenn nicht benötigt
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddEntry = async () => {
    const newEntry: EntryType = {
      date,
      category: selectedCategory,
      hours: parseFloat(inputValue),
      user: userId,
    };

    try {
      const response = await fetch('/api/hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      const data = await response.json();
      if (data.success) {
        const createdEntry = { ...newEntry, _id: data.data[0]._id }; // Assuming the response data is an array of created entries
        setEntriesByDate((prevEntriesByDate) => {
          const dateEntries = prevEntriesByDate[date] || [];
          return {
            ...prevEntriesByDate,
            [date]: [...dateEntries, createdEntry],
          };
        });
        setConfirmationMessage('Eintrag erfolgreich hinzugefügt!');
        setTimeout(() => setConfirmationMessage(''), 3000);

        // Formular zurücksetzen
        setSelectedCategory('');
        setInputValue('');
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const handleUpdateEntry = async () => {
    if (!editEntry) return;

    const updatedEntry: EntryType = {
      ...editEntry,
      date,
      category: selectedCategory,
      hours: parseFloat(inputValue),
    };

    console.log('Updating entry with ID:', editEntry._id);

    try {
      const response = await fetch(`/api/hours`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editEntry._id, hours: updatedEntry.hours }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setEntriesByDate((prevEntriesByDate) => {
          const dateEntries = prevEntriesByDate[date].map((entry) =>
            entry._id === updatedEntry._id ? updatedEntry : entry
          );
          return {
            ...prevEntriesByDate,
            [date]: dateEntries,
          };
        });
        setConfirmationMessage('Eintrag erfolgreich aktualisiert!');
        setTimeout(() => setConfirmationMessage(''), 3000);

        // Formular zurücksetzen
        setSelectedCategory('');
        setInputValue('');
        setEditEntry(null);
      }
    } catch (error) {
      console.error('Error updating entry:', error.message);
    }
  };

  const handleEditEntry = (entry: EntryType) => {
    setEditEntry(entry);
    setDate(entry.date);
    setSelectedCategory(entry.category);
    setInputValue(entry.hours.toString());
  };

  const handleDeleteEntry = async (entry: EntryType) => {
    try {
      console.log('Deleting entry with ID:', entry._id);
      const response = await fetch(`/api/hours?id=${entry._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setEntriesByDate((prevEntriesByDate) => {
          const dateEntries = prevEntriesByDate[entry.date].filter((e) => e._id !== entry._id);
          return {
            ...prevEntriesByDate,
            [entry.date]: dateEntries,
          };
        });
        setConfirmationMessage('Eintrag erfolgreich gelöscht!');
        setTimeout(() => setConfirmationMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting entry:', error.message);
    }
  };

  // Filtern Sie die Einträge nach dem ausgewählten Datum
  const filteredEntries = entriesByDate[date] || [];

  // Holen Sie die Einträge des aktuellen Monats
  const monthlyEntries = Object.keys(entriesByDate).reduce((acc: { [key: string]: EntryType[] }, key) => {
    if (key.startsWith(date.substring(0, 7))) {
      acc[key] = entriesByDate[key];
    }
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold">Stunden eintragen</h1>
      {confirmationMessage && (
        <div className="bg-green-500 text-white py-2 px-4 rounded mb-4">
          {confirmationMessage}
        </div>
      )}
      <CalendarComponent onDateClick={handleDateClick} onActiveStartDateChange={handleMonthChange} />
      <button
        onClick={() => setShowMonthlyEntries(!showMonthlyEntries)}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        {showMonthlyEntries ? 'Tagesansicht' : 'Monatsansicht'}
      </button>
      <EntryList
        entriesByDate={showMonthlyEntries ? monthlyEntries : { [date]: filteredEntries }}
        handleEditEntry={handleEditEntry}
        handleDeleteEntry={handleDeleteEntry}
        showMonthlyEntries={showMonthlyEntries} // Übergeben des Flags
      />
      <EntryForm
        selectedCategory={selectedCategory}
        inputValue={inputValue}
        onCategoryChange={setSelectedCategory}
        onInputChange={handleInputChange}
        handleAddEntry={handleAddEntry}
        handleUpdateEntry={handleUpdateEntry}
        editEntry={editEntry !== null}
        date={date} // Übergeben des Datums
        onDateChange={setDate} // Übergeben der Datumsänderungsfunktion
      />
      {showMonthlyEntries && <ExportToExcel entriesByDate={monthlyEntries} currentMonth={date.substring(0, 7)} />}
    </div>
  );
}
