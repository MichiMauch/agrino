"use client";
import { ChangeEvent } from 'react';
import CategorySelect from './CategorySelect';

type EntryFormProps = {
  date: string;
  selectedCategory: string;
  inputValue: string;
  onDateChange: (date: string) => void;
  onCategoryChange: (category: string) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAddEntry: () => void;
  handleUpdateEntry: () => void;
  editEntry: boolean;
};

export default function EntryForm({
  date,
  selectedCategory,
  inputValue,
  onDateChange,
  onCategoryChange,
  onInputChange,
  handleAddEntry,
  handleUpdateEntry,
  editEntry
}: EntryFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (editEntry) {
          handleUpdateEntry();
        } else {
          handleAddEntry();
        }
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-xl font-medium">Datum</label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="mt-1 block w-full"
        />
      </div>
      <CategorySelect selectedCategory={selectedCategory} onSelectCategory={onCategoryChange} />
      {selectedCategory && !['ferien', 'unfall', 'schule', 'dienst'].includes(selectedCategory) && (
        <div>
          <label className="block text-xl font-medium">{selectedCategory}</label>
          <input
            type="number"
            value={inputValue}
            onChange={onInputChange}
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
  );
}
