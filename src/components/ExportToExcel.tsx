import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { categories } from './CategorySelect';

type EntryType = {
  _id?: string;
  date: string;
  category: string;
  hours: number;
  user: number;
};

type ExportToExcelProps = {
  entriesByDate: { [key: string]: EntryType[] };
  currentMonth: string;
};

const ExportToExcel: React.FC<ExportToExcelProps> = ({ entriesByDate, currentMonth }) => {
  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const wsData: any[][] = [];

    // Header
    const header = ['Datum', ...categories.map(cat => cat.label)];
    wsData.push(header);

    // Rows
    const year = parseInt(currentMonth.split('-')[0], 10);
    const month = parseInt(currentMonth.split('-')[1], 10);
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentMonth}-${day.toString().padStart(2, '0')}`;
      const row = [date];
      categories.forEach(category => {
        const entry = entriesByDate[date]?.find(entry => entry.category === category.value);
        row.push(entry ? entry.hours.toString() : ''); // Ensure the value is a string
      });
      wsData.push(row);
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Monatsrapport');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Monatsrapport_${currentMonth}.xlsx`);
  };

  return (
    <button onClick={handleExport} className="bg-blue-500 text-white py-2 px-4 rounded mb-4">
      Daten herunterladen {new Date(currentMonth).toLocaleDateString('de-DE', { month: 'long' })}
    </button>
  );
};

export default ExportToExcel;
