import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { categories } from './CategorySelect';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

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
  month: string;
  year: string;
  userId: number;
};

const ExportToExcel: React.FC<ExportToExcelProps> = ({ entriesByDate, month, year, userId }) => {
  const [isSending, setIsSending] = useState(false);
  const [sendTime, setSendTime] = useState<string | null>(null);

  const monthDate = new Date(parseInt(year), parseInt(month) - 1);
  const monthName = format(monthDate, 'MMMM', { locale: de });

  useEffect(() => {
    // Fetch the last send time from the database when the component mounts
    const fetchSendTime = async () => {
      try {
        const response = await fetch(`/api/getEmail?userId=${userId}&month=${month}&year=${year}`);
        const data = await response.json();
        if (response.ok) {
          setSendTime(data.sendTime);
        }
      } catch (error) {
        console.error('Error fetching send time:', error);
      }
    };

    fetchSendTime();
  }, [userId, month, year]);

  const createExcelFile = () => {
    const wb = XLSX.utils.book_new();
    const wsData: any[][] = [];

    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();

    wsData.push([`Agrino Monatsrapport ${monthName} ${year}`]);
    wsData.push([]);

    const header = ['Datum', ...categories.map(cat => cat.label), 'Tagesgesamt', 'Bemerkungen'];
    wsData.push(header);

    const categoryTotals: { [key: string]: number } = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month}-${day.toString().padStart(2, '0')}`;
      const formattedDate = format(parseISO(date), 'EEEE, dd.MM.', { locale: de });
      const row = [formattedDate];
      let dayTotal = 0;
      let remarks = '';

      categories.forEach(category => {
        const entry = entriesByDate[date]?.find(entry => entry.category === category.value);
        const hours = entry ? entry.hours : 0;
        row.push(hours > 0 ? hours.toString() : '');
        dayTotal += hours;

        if (entry && entry.remarks) {
          remarks = entry.remarks;
        }

        if (!categoryTotals[category.value]) {
          categoryTotals[category.value] = 0;
        }
        categoryTotals[category.value] += hours;
      });

      row.push(dayTotal > 0 ? dayTotal.toString() : '');
      row.push(remarks);
      wsData.push(row);
    }

    const totalsRow = ['Gesamt'];
    let overallTotal = 0;
    categories.forEach(category => {
      const total = categoryTotals[category.value] || 0;
      totalsRow.push(total > 0 ? total.toString() : '');
      overallTotal += total;
    });
    totalsRow.push(overallTotal > 0 ? overallTotal.toString() : '');
    totalsRow.push('');
    wsData.push([]);
    wsData.push(totalsRow);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Monatsrapport');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/octet-stream' });
  };

  const handleExport = () => {
    const blob = createExcelFile();
    saveAs(blob, `Monatsrapport_${year}-${month}.xlsx`);
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    const blob = createExcelFile();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64data = reader.result?.toString().split(',')[1];
      try {
        const response = await fetch(`/api/send-email?userId=${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: `Monatsrapport ${monthName} ${year}`,
            text: `Hier ist der Monatsrapport für ${monthName} ${year}.`,
            attachment: base64data,
            month,
            year,
          }),
        });
        const result = await response.json();
        if (response.ok) {
          setSendTime(result.sendTime);
        } else {
          alert('Fehler beim Senden der E-Mail');
        }
      } catch (error) {
        alert('Fehler beim Senden der E-Mail');
      }
      setIsSending(false);
    };
  };

  return (
    <div className="flex space-x-4 w-full items-center">
      <div className="flex w-full space-x-4">
        <button onClick={handleExport} className="bg-customYellow-200 text-black py-2 px-4 rounded flex items-center justify-center w-1/4">
          <FontAwesomeIcon icon={faDownload} className="mr-2" />
        </button>
        <button onClick={handleSendEmail} className="bg-customYellow-200 text-black py-2 px-4 rounded flex items-center justify-center w-3/4" disabled={isSending}>
          {isSending ? 'Senden...' : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
              senden
            </>
          )}
        </button>
      </div>
      {sendTime && <div className="text-sm text-gray-600 mt-2">Gesendet: {new Date(sendTime).toLocaleString()}</div>}
    </div>
  );
};

export default ExportToExcel;
