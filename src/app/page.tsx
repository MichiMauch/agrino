"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import users, { getUserById } from '../lib/users';

type HoursType = {
  [key: string]: number;
};

type EntryType = {
  _id?: string; // Optional ID field for existing entries
  date: string;
  category: string;
  hours: number;
};

const categoriesWithFixedHours = [
  'Ferien/Frei',
  'Unfall/Krankheit',
  'Schule',
  'Dienst'
];

const categories = [
  { value: 'milchvieh', label: 'Milchvieh' },
  { value: 'mutterkuhe', label: 'Mutterkühe' },
  { value: 'ackerbau', label: 'Ackerbau' },
  { value: 'biogas', label: 'Biogas' },
  { value: 'robbergMaxi', label: 'Robberg Maxi' },
  { value: 'oko', label: 'Öko' },
  { value: 'pferdepension', label: 'Pferdepension' },
  { value: 'prodVerarb', label: 'Prod. Verarb.' },
  { value: 'schuUndBau', label: 'Schu und Bau' },
  { value: 'garten', label: 'Garten' },
  { value: 'saubMachGeb', label: 'Saub. Mach. Geb.' },
  { value: 'administration', label: 'Administration' },
  { value: 'nebenverwer', label: 'Nebenverwer' },
  { value: 'arbeitFurDritte', label: 'Arbeit für Dritte' },
  { value: 'Ferien/Frei', label: 'Ferien/Frei' },
  { value: 'Unfall/Krankheit', label: 'Unfall/Krankheit' },
  { value: 'Schule', label: 'Schule' },
  { value: 'Dienst', label: 'Dienst' },
];

export default function FillHours() {
  const searchParams = useSearchParams();
  const userId = parseInt(searchParams?.get('user') || '1'); // Default user ID to 1 if not provided in URL
  const user = getUserById(userId);

  const [date, setDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [entriesByDate, setEntriesByDate] = useState<{ [key: string]: EntryType[] }>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [editEntry, setEditEntry] = useState<EntryType | null>(null);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);

    // Fetch existing entries for the user
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

          // Monatsgesamtstunden aktualisieren
          const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
          setMonthlyTotal(totalHours);
        } else {
          console.error('Error fetching data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEntries();
  }, [userId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddEntry = () => {
    if (selectedCategory) {
      const newHours = categoriesWithFixedHours.includes(selectedCategory) ? 10 : parseFloat(inputValue);

      if (!isNaN(newHours)) {
        const newEntry = { date, category: selectedCategory, hours: newHours };

        setEntriesByDate((prevEntriesByDate) => {
          const dateEntries = prevEntriesByDate[date] || [];
          const updatedDateEntries = [...dateEntries, newEntry];

          return {
            ...prevEntriesByDate,
            [date]: updatedDateEntries
          };
        });

        setInputValue('');

        // JSON-Daten aktualisieren und ergänzen
        const newRequestData = { date, category: selectedCategory, hours: newHours, user: userId };
        setJsonData((prevJsonData) => [...prevJsonData, newRequestData]);

        // Monatsgesamtstunden aktualisieren
        setMonthlyTotal((prevTotal) => prevTotal + newHours);
      }
    }
  };

  const handleEditEntry = (entry: EntryType) => {
    setEditEntry(entry);
    setDate(entry.date);
    setSelectedCategory(entry.category);
    setInputValue(categoriesWithFixedHours.includes(entry.category) ? '10' : entry.hours.toString());
  };

  const handleDeleteEntry = async (entry: EntryType) => {
    if (entry._id) {
      try {
        const response = await fetch(`/api/hours?id=${entry._id}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        if (data.success) {
          console.log('Eintrag erfolgreich gelöscht:', data.data);
          setEntriesByDate((prevEntriesByDate) => {
            const dateEntries = prevEntriesByDate[entry.date] || [];
            const updatedDateEntries = dateEntries.filter(e => e._id !== entry._id);
            return {
              ...prevEntriesByDate,
              [entry.date]: updatedDateEntries,
            };
          });

          // Monatsgesamtstunden aktualisieren
          setMonthlyTotal((prevTotal) => prevTotal - entry.hours);
        } else {
          console.error('Fehler beim Löschen des Eintrags:', data.error);
        }
      } catch (error) {
        console.error('Fehler beim Senden der Anfrage:', error);
      }
    }
  };

  useEffect(() => {
    if (editEntry) {
      setSelectedCategory(editEntry.category);
      setDate(editEntry.date);
      setInputValue(editEntry.hours.toString());
    }
  }, [editEntry]);

  const handleUpdateEntry = async () => {
    if (editEntry && inputValue) {
      const updatedHours = parseFloat(inputValue);
      if (!isNaN(updatedHours)) {
        try {
          const response = await fetch('/api/hours', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: editEntry._id, hours: updatedHours, user: userId, category: editEntry.category, date: editEntry.date }),
          });

          const data = await response.json();
          if (data.success) {
            console.log('Eintrag erfolgreich aktualisiert:', data.data);
            setResponseData(data.data);

            // Aktualisieren Sie den Eintrag lokal
            setEntriesByDate((prevEntriesByDate) => {
              const dateEntries = prevEntriesByDate[editEntry.date] || [];
              const updatedDateEntries = dateEntries.map(entry =>
                entry._id === editEntry._id ? { ...entry, hours: updatedHours } : entry
              );
              return {
                ...prevEntriesByDate,
                [editEntry.date]: updatedDateEntries
              };
            });

            // Monatsgesamtstunden aktualisieren
            const hoursDifference = updatedHours - editEntry.hours;
            setMonthlyTotal((prevTotal) => prevTotal + hoursDifference);

            setEditEntry(null);
            setInputValue('');
            setDate(new Date().toISOString().split('T')[0]);
            setSelectedCategory('');
          } else {
            console.error('Fehler beim Aktualisieren des Eintrags:', data.error);
          }
        } catch (error) {
          console.error('Fehler beim Senden der Anfrage:', error);
        }
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (jsonData.length === 0) {
      console.error('Keine Daten zum Senden');
      return;
    }

    try {
      const response = await fetch('/api/hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Daten erfolgreich gesendet:', data.data);
        setResponseData(data.data);
        setJsonData([]); // Leeren Sie die jsonData nach erfolgreichem Senden
      } else {
        console.error('Fehler beim Senden der Daten:', data.error);
      }
    } catch (error) {
      console.error('Fehler beim Senden der Anfrage:', error);
    }
  };

  const sortedDates = Object.keys(entriesByDate).sort();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stundeneintrag von {user?.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xl font-medium">Datum</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label className="block text-xl font-medium">Kategorie</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full"
          >
            <option value="" disabled>Wähle eine Kategorie</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        {selectedCategory && (
          <div>
            <label className="block text-xl font-medium">{categories.find(cat => cat.value === selectedCategory)?.label}</label>
            {!categoriesWithFixedHours.includes(selectedCategory) && (
              <input 
                type="number" 
                value={inputValue}
                onChange={handleInputChange} 
                className="mt-1 block w-full"
              />
            )}
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
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Speichern</button>
      </form>
      {responseData && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Gesendete Daten</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Einträge</h2>
        {sortedDates.map(date => (
          <div key={date}>
            <h3 className="text-lg font-bold">{formatDate(date)}</h3>
            <ul className="list-disc list-inside ml-4">
              {entriesByDate[date].map((entry, index) => (
                <li key={index} className="mb-1">
                  <span className="font-medium">{entry.category}:</span> {entry.hours} Stunden
                  <button 
                    className="ml-2 text-sm text-blue-500"
                    onClick={() => handleEditEntry(entry)}
                  >
                    Bearbeiten
                  </button>
                  <button 
                    className="ml-2 text-sm text-red-500"
                    onClick={() => handleDeleteEntry(entry)}
                  >
                    Löschen
                  </button>
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-bold mt-2">Total: {entriesByDate[date].reduce((sum, entry) => sum + entry.hours, 0)} Stunden
            </h3>
            <hr className="my-4" />
          </div>
        ))}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Total Stunden im Monat: {monthlyTotal}</h2>
        </div>
      </div>
    </div>
  );
}
