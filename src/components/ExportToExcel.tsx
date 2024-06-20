import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { categories } from './CategorySelect';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

type EntryType = {
  _id?: string;
  date: string;
  category: string;
  hours: number;
  remarks?: string;
  user: number;
};

type ExportToExcelProps = {
  entriesByDate: { [key: string]: EntryType[] };
  currentMonth: string;
};

const ExportToExcel: React.FC<ExportToExcelProps> = ({ entriesByDate, currentMonth }) => {
  // Monat aus currentMonth extrahieren und formatieren
  const year = parseInt(currentMonth.split('-')[0], 10);
  const month = parseInt(currentMonth.split('-')[1], 10);
  const monthDate = new Date(year, month - 1); // Monat ist 0-basiert
  const monthName = format(monthDate, 'MMMM', { locale: de });

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const wsData: any[][] = [];

    const daysInMonth = new Date(year, month, 0).getDate();

    // Titelzeile
    wsData.push([`Agrino Monatsrapport ${monthName} ${year}`]);

    // Leere Zeile nach dem Titel
    wsData.push([]);

    // Header
    const header = ['Datum', ...categories.map(cat => cat.label), 'Tagesgesamt', 'Bemerkungen'];
    wsData.push(header);

    // Rows
    const categoryTotals: { [key: string]: number } = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentMonth}-${day.toString().padStart(2, '0')}`;
      const formattedDate = format(parseISO(date), 'EEEE, dd.MM.', { locale: de });
      const row = [formattedDate];
      let dayTotal = 0;
      let remarks = '';

      categories.forEach(category => {
        const entry = entriesByDate[date]?.find(entry => entry.category === category.value);
        const hours = entry ? entry.hours : 0;
        row.push(hours > 0 ? hours.toString() : ''); // Ensure the value is a string and empty if 0
        dayTotal += hours;

        if (entry && entry.remarks) {
          remarks = entry.remarks;
        }

        if (!categoryTotals[category.value]) {
          categoryTotals[category.value] = 0;
        }
        categoryTotals[category.value] += hours;
      });

      row.push(dayTotal > 0 ? dayTotal.toString() : ''); // Ensure the day total is empty if 0
      row.push(remarks);
      wsData.push(row);
    }

    // Totals row for categories
    const totalsRow = ['Gesamt'];
    let overallTotal = 0;
    categories.forEach(category => {
      const total = categoryTotals[category.value] || 0;
      totalsRow.push(total > 0 ? total.toString() : ''); // Ensure the category total is empty if 0
      overallTotal += total;
    });
    totalsRow.push(overallTotal > 0 ? overallTotal.toString() : ''); // Ensure the overall total is empty if 0
    totalsRow.push(''); // Empty cell for remarks column
    wsData.push([]);
    wsData.push(totalsRow);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Monatsrapport');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Monatsrapport_${currentMonth}.xlsx`);
  };

  return (
    <button onClick={handleExport} className="bg-blue-500 text-white py-2 px-4 rounded mb-4">
      Daten herunterladen {monthName}
    </button>
  );
};

export default ExportToExcel;
