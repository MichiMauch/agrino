"use client";
import { useState, useEffect, ChangeEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import CalendarComponent from '../components/CalendarComponent';
import users, { getUserById } from '../lib/users';
import ExportToExcel from '../components/ExportToExcel';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import Image from 'next/image';
import agrinoLogo from '/public/images/agrino_logo_web.png';


type HoursType = {
  [key: string]: number;
};

type EntryType = {
  _id?: string;
  date: string;
  category: string;
  hours: number;
  remarks: string;
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
  const [remarks, setRemarks] = useState<string>('');
  const [entriesByDate, setEntriesByDate] = useState<{ [key: string]: EntryType[] }>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [editEntry, setEditEntry] = useState<EntryType | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [showMonthlyEntries, setShowMonthlyEntries] = useState<boolean>(false);

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
    setShowMonthlyEntries(false);
  };

  const handleMonthChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {};

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleRemarksChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRemarks(e.target.value);
    console.log("Bemerkung geändert:", e.target.value);
  };

  const handleAddEntry = async () => {
    console.log("Bemerkung beim Hinzufügen:", remarks);

    const newEntry: EntryType = {
      date,
      category: selectedCategory,
      hours: parseFloat(inputValue),
      remarks,
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
        const createdEntry = { ...newEntry, _id: data.data._id, remarks: data.data.remarks };
        setEntriesByDate((prevEntriesByDate) => {
          const dateEntries = prevEntriesByDate[date] || [];
          return {
            ...prevEntriesByDate,
            [date]: [...dateEntries, createdEntry],
          };
        });
        setConfirmationMessage('Eintrag erfolgreich hinzugefügt!');
        setTimeout(() => setConfirmationMessage(''), 3000);

        setSelectedCategory('');
        setInputValue('');
        setRemarks('');
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const handleUpdateEntry = async () => {
    if (!editEntry) return;

    console.log("Bemerkung beim Aktualisieren:", remarks);

    const updatedEntry: EntryType = {
      ...editEntry,
      date,
      category: selectedCategory,
      hours: parseFloat(inputValue),
      remarks,
    };

    console.log('Updating entry with ID:', editEntry._id);

    try {
      const response = await fetch(`/api/hours`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: updatedEntry._id, hours: updatedEntry.hours, remarks: updatedEntry.remarks }),
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

        setSelectedCategory('');
        setInputValue('');
        setRemarks('');
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
    setRemarks(entry.remarks);
    console.log("Bemerkung beim Bearbeiten:", entry.remarks);
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

  const handleSaveEntry = async (updatedEntry: EntryType) => {
    console.log('Saving entry with ID:', updatedEntry._id);
    try {
      const response = await fetch(`/api/hours`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: updatedEntry._id, hours: updatedEntry.hours, remarks: updatedEntry.remarks }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setEntriesByDate((prevEntriesByDate) => {
          const dateEntries = prevEntriesByDate[updatedEntry.date].map((entry) =>
            entry._id === updatedEntry._id ? updatedEntry : entry
          );
          return {
            ...prevEntriesByDate,
            [updatedEntry.date]: dateEntries,
          };
        });
        setConfirmationMessage('Eintrag erfolgreich aktualisiert!');
        setTimeout(() => setConfirmationMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving entry:', error.message);
    }
  };

  const filteredEntries = entriesByDate[date] || [];

  const monthlyEntries = Object.keys(entriesByDate).reduce((acc: { [key: string]: EntryType[] }, key) => {
    if (key.startsWith(date.substring(0, 7))) {
      acc[key] = entriesByDate[key];
    }
    return acc;
  }, {});

  const dailyHours = Object.keys(entriesByDate).reduce((acc: { [key: string]: number }, key) => {
    acc[key] = entriesByDate[key].reduce((total, entry) => total + entry.hours, 0);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4">
    <div className="flex justify-center mb-4">
      <Image src={agrinoLogo} alt="Agrino Logo" width={100} height={100} />
      </div>
      <h1 className="text-2xl font-bold">{user ? `${user.name}: Stunden eintragen` : 'Stunden eintragen'}</h1>
      {confirmationMessage && (
        <div className="bg-green-500 text-white py-2 px-4 rounded mb-4">
          {confirmationMessage}
        </div>
      )}
      <CalendarComponent
        onDateClick={handleDateClick}
        onActiveStartDateChange={handleMonthChange}
        entriesByDate={dailyHours}
        locale="de" // Locale hinzufügen
      />
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
        handleSaveEntry={handleSaveEntry}
        showMonthlyEntries={showMonthlyEntries}
      />
      <EntryForm
        selectedCategory={selectedCategory}
        inputValue={inputValue}
        onCategoryChange={setSelectedCategory}
        onInputChange={handleInputChange}
        handleAddEntry={handleAddEntry}
        handleUpdateEntry={handleUpdateEntry}
        editEntry={editEntry !== null}
        date={date}
        onDateChange={setDate}
        remarks={remarks}
        onRemarksChange={handleRemarksChange}
      />
      {showMonthlyEntries && <ExportToExcel entriesByDate={monthlyEntries} currentMonth={date.substring(0, 7)} />}
      <div className="fixed bottom-0 left-0 w-full flex justify-around bg-white p-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded">
          Monatsansicht
        </button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded">
          Eintragen
        </button>
</div>
    </div>
  );
}
