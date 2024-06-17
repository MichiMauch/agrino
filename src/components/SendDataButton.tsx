import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { format, parse } from 'date-fns';
import { de } from 'date-fns/locale';
import { categories } from './CategorySelect';

type EntryType = {
  _id?: string;
  date: string;
  category: string;
  hours: number;
  user: number;
};

type SendDataButtonProps = {
  entriesByDate: { [key: string]: EntryType[] };
};

const SendDataButton: React.FC<SendDataButtonProps> = ({ entriesByDate }) => {
  const downloadExcel = (month: string) => {
    const wb = XLSX.utils.book_new();
    const wsData: (string | number)[][] = [];

    // Kopfzeile
    const headers = ['Datum', ...categories.map(category => category.label)];
    wsData.push(headers);

    // Datenzeilen
    Object.keys(entriesByDate).forEach(date => {
      if (date.startsWith(month)) {
        const dateEntries = entriesByDate[date];
        const row = [format(new Date(date), 'EEEE, dd.MM.yy', { locale: de })];
        categories.forEach(category => {
          const entry = dateEntries.find(entry => entry.category === category.value);
          row.push(entry ? entry.hours.toString() : ''); // Stellen Sie sicher, dass die Werte als Strings formatiert sind
        });
        wsData.push(row);
      }
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Titelzelle
    const title = `Monatsrapport Agrino ${month.substring(0, 4)}`;
    XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' });
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
    ws['A1'].s = { alignment: { horizontal: 'center' } };

    XLSX.utils.book_append_sheet(wb, ws, 'Monatsrapport');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Datei herunterladen
    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `Monatsrapport_${month}.xlsx`);
  };

  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(2024, i, 1);
    return {
      label: format(monthDate, 'MMMM', { locale: de }),
      value: format(monthDate, 'yyyy-MM'),
    };
  });

  return (
    <div>
      {months.map(month => (
        <button
          key={month.value}
          onClick={() => downloadExcel(month.value)}
          className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        >
          {month.label} herunterladen
        </button>
      ))}
    </div>
  );
};

export default SendDataButton;
