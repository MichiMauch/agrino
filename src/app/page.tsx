"use client";

import { useState, useEffect, ChangeEvent, ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import CalendarComponent from '../components/CalendarComponent';
import users, { getUserById } from '../lib/users';
import ExportToExcel from '../components/ExportToExcel';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Image from 'next/image';
import agrinoLogo from '/public/images/agrino_logo_web.png';

const UserParamsProvider = dynamic(() => import('../components/UserParamsProvider'), { ssr: false });

type HoursType = {
  [key: string]: number;
};

type EntryType = {
  _id?: string;
  date: string;
  category: string;
  hours: number;
  remarks?: string;
  user: number;
};

const FillHoursContent = ({ userId }: { userId: number }) => {
  const user = getUserById(userId);
  const [date, setDate] = useState<string>('');
  const [hours, setHours] = useState<HoursType>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [entriesByDate, setEntriesByDate] = useState<{ [key: string]: EntryType[] }>({});
  const [remarksByDate, setRemarksByDate] = useState<{ [key: string]: string }>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [editEntry, setEditEntry] = useState<EntryType | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [showMonthlyEntries, setShowMonthlyEntries] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false); // Modal visibility state
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

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
          const remarksByDate = entries.reduce((acc: { [key: string]: string }, entry: EntryType) => {
            acc[entry.date] = entry.remarks || '';
            return acc;
          }, {});
          setEntriesByDate(entriesByDate);
          setRemarksByDate(remarksByDate);
          console.log('Fetched entries:', entriesByDate);
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, [userId]);

  const handleDateClick = (date: Date) => {
    const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dateString = adjustedDate.toISOString().split('T')[0];
    setDate(dateString);
    if (!entriesByDate[dateString] || entriesByDate[dateString].length === 0) {
      setShowModal(true); // Show modal if no entries for the date
    } else {
      setShowMonthlyEntries(false);
    }
  };

  const handleMonthChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {};

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleRemarksChange = (e: ChangeEvent<HTMLTextAreaElement>, date: string) => {
    const newRemarks = e.target.value;
    setRemarksByDate((prevRemarks) => ({
      ...prevRemarks,
      [date]: newRemarks,
    }));
  };

  const saveRemarks = async (date: string) => {
    try {
      const newRemarks = remarksByDate[date];
      const response = await fetch('/api/hours', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, remarks: newRemarks }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setConfirmationMessage('Bemerkung erfolgreich gespeichert!');
        setTimeout(() => setConfirmationMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving remarks:', error.message);
    }
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
        setShowModal(false); // Hide modal after adding entry
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
        setShowModal(false); // Hide modal after updating entry
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
    setRemarks(entry.remarks || '');
    setShowModal(true); // Show modal when editing an entry
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

  const openModalForToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    setShowModal(true);
  };

  const downloadMonth = (monthOffset: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthOffset);
    const formattedDate = format(date, 'yyyy-MM');
    setSelectedMonth(formattedDate.split('-')[1]);
    setSelectedYear(formattedDate.split('-')[0]);
    setShowDownloadModal(true);
  };

  const closeModal = () => {
    setShowDownloadModal(false);
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
    <div className="container mx-auto px-4 pb-20">
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
        locale="de"
      />
      <EntryList
        entriesByDate={showMonthlyEntries ? monthlyEntries : { [date]: filteredEntries }}
        handleEditEntry={handleEditEntry}
        handleDeleteEntry={handleDeleteEntry}
        showMonthlyEntries={showMonthlyEntries}
        remarksByDate={remarksByDate}
        handleRemarksChange={handleRemarksChange}
        saveRemarks={saveRemarks}
      />
      {showMonthlyEntries && <ExportToExcel entriesByDate={monthlyEntries} month={date.split('-')[1]} year={date.split('-')[0]} />}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl mb-4">{editEntry ? 'Eintrag bearbeiten' : 'Neuen Eintrag hinzufügen'}</h2>
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
              onRemarksChange={(e) => handleRemarksChange(e, date)}
            />
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white py-2 px-4 rounded mt-4"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
      {showDownloadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl mb-4">Monatsberichte herunterladen</h2>
            {[0, 1, 2, 3].map(offset => {
              const date = new Date();
              date.setMonth(date.getMonth() - offset);
              const month = format(date, 'MM');
              const year = format(date, 'yyyy');
              return (
                <ExportToExcel key={offset} entriesByDate={entriesByDate} month={month} year={year} />
              );
            })}
            <button
              onClick={closeModal}
              className="bg-red-500 text-white py-2 px-4 rounded mt-4"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full flex justify-around p-4 bg-white">
        <button
          onClick={() => setShowMonthlyEntries(!showMonthlyEntries)}
          className="flex-1 bg-[#C8D300] text-white py-2 px-4 rounded mx-2 h-12"
        >
          {showMonthlyEntries ? <i className="fas fa-list-ol"></i> : <i className="fas fa-calendar-alt"></i>}
        </button>
        <button
          onClick={openModalForToday}
          className="flex-1 bg-[#C8D300] text-white py-2 px-4 rounded mx-2 h-12"
        >
          <i className="fas fa-plus"></i>
        </button>
        <button
          onClick={() => downloadMonth(0)}
          className="flex-1 bg-[#C8D300] text-white py-2 px-4 rounded mx-2 h-12"
        >
          <i className="fas fa-file-download"></i>
        </button>
      </div>
    </div>
  );
};

const Page = () => {
  const [userId, setUserId] = useState<number | null>(null);

  const handleUserIdResolved = (resolvedUserId: number) => {
    setUserId(resolvedUserId);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserParamsProvider onUserIdResolved={handleUserIdResolved}>
        {(resolvedUserId: number) => userId !== null && <FillHoursContent userId={resolvedUserId} />}
      </UserParamsProvider>
    </Suspense>
  );
};

export default Page;
