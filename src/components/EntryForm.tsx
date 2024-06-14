import React, { ChangeEvent, FormEvent, useEffect } from 'react';

type EntryType = {
  _id?: string;
  date: string;
  category: string;
  hours: number;
};

type EntryFormProps = {
  date: string;
  selectedCategory: string;
  inputValue: string;
  onDateChange: (date: string) => void;
  onCategoryChange: (category: string) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddEntry: () => void;
  onUpdateEntry: () => void;
  onSubmit: (e: FormEvent) => void;
  editEntry: EntryType | null;
};

const categoriesWithFixedHours = ['ferienFrei', 'unfallKrankheit', 'schule', 'dienst'];
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
  { value: 'ferienFrei', label: 'Ferien/Frei' },
  { value: 'unfallKrankheit', label: 'Unfall/Krankheit' },
  { value: 'schule', label: 'Schule' },
  { value: 'dienst', label: 'Dienst' },
];

const EntryForm: React.FC<EntryFormProps> = ({
  date,
  selectedCategory,
  inputValue,
  onDateChange,
  onCategoryChange,
  onInputChange,
  onAddEntry,
  onUpdateEntry,
  onSubmit,
  editEntry
}) => {
  useEffect(() => {
    if (editEntry) {
      onCategoryChange(editEntry.category);
      onDateChange(editEntry.date);
      if (!categoriesWithFixedHours.includes(editEntry.category)) {
        onInputChange({ target: { value: editEntry.hours.toString() } } as ChangeEvent<HTMLInputElement>);
      }
    }
  }, [editEntry]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xl font-medium">Datum</label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block text-xl font-medium">Kategorie</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
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
      {selectedCategory && !categoriesWithFixedHours.includes(selectedCategory) && (
        <div>
          <label className="block text-xl font-medium">{selectedCategory}</label>
          <input
            type="number"
            value={inputValue}
            onChange={onInputChange}
            className="mt-1 block w-full"
          />
        </div>
      )}
      {editEntry ? (
        <button
          type="button"
          onClick={onUpdateEntry}
          className="bg-yellow-500 text-white py-1 px-3 rounded mt-2"
        >
          Eintrag aktualisieren
        </button>
      ) : (
        <button
          type="button"
          onClick={onAddEntry}
          className="bg-green-500 text-white py-1 px-3 rounded mt-2"
        >
          Eintrag hinzufügen
        </button>
      )}
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-2">Speichern</button>
    </form>
  );
};

export default EntryForm;
