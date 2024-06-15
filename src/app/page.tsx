"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import users, { getUserById } from '../lib/users';
import CategorySelect, { categories } from '../components/CategorySelect';

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
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [editEntry, setEditEntry] = useState<EntryType | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

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
        setEntriesByDate((prevEntriesByDate) => {
          const dateEntries = prevEntriesByDate[date] || [];
          return {
            ...prevEntriesByDate,
            [date]: [...dateEntries, newEntry],
          };
        });
        setConfirmationMessage('Eintrag erfolgreich hinzugefügt!');
        setTimeout(() => setConfirmationMessage(''), 3000);
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
  
  
  
  
  return (
    <div>
      <h1 className="text-2xl font-bold">Stunden eintragen</h1>
      {confirmationMessage && (
        <div className="bg-green-500 text-white py-2 px-4 rounded mb-4">
          {confirmationMessage}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (editEntry) {
            handleUpdateEntry();
          } else {
            handleAddEntry();
          }
        }}
      >
        <div>
          <label htmlFor="date" className="block text-xl font-medium">
            Datum
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-xl font-medium">
            Kategorie
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full"
          >
            <option value="" disabled>
              Wähle eine Kategorie
            </option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        {selectedCategory && (
          <div>
            <label className="block text-xl font-medium">
              {categories.find((cat) => cat.value === selectedCategory)?.label}
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
            {editEntry ? (
              <button
                type="button"
                onClick={handleUpdateEntry}
                className="bg-yellow-500 text-white py-1 px-3 rounded mt-2"
              >
                Eintrag aktualisieren
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddEntry}
                className="bg-green-500 text-white py-1 px-3 rounded mt-2"
              >
                Eintrag hinzufügen
              </button>
            )}
          </div>
        )}
      </form>
      <EntryList
        entriesByDate={entriesByDate}
        handleEditEntry={handleEditEntry}
        handleDeleteEntry={handleDeleteEntry}
      />
      {responseData && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Gesendete Daten</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
