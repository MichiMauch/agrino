import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Entry {
  _id?: string;
  date: string;
  category: string;
  hours: number;
  user: number;
}

interface EntryListProps {
  entriesByDate: { [key: string]: Entry[] };
  handleEditEntry: (entry: Entry) => void;
  handleDeleteEntry: (entry: Entry) => void;
}

export default function EntryList({ entriesByDate, handleEditEntry, handleDeleteEntry }: EntryListProps) {
  const sortedDates = Object.keys(entriesByDate).sort();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long' as const,
      day: '2-digit' as const,
      month: '2-digit' as const,
      year: 'numeric' as const,
    };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  return (
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
    </div>
  );
}
