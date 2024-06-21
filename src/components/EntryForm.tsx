"use client";
import { ChangeEvent } from 'react';
import { categories } from './CategorySelect';

type EntryFormProps = {
  date: string;
  selectedCategory: string;
  inputValue: string;
  remarks: string;
  onDateChange: (date: string) => void;
  onCategoryChange: (category: string) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemarksChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleAddEntry: () => void;
  handleUpdateEntry: () => void;
  editEntry: boolean;
};

export default function EntryForm({
  date,
  selectedCategory,
  inputValue,
  remarks,
  onDateChange,
  onCategoryChange,
  onInputChange,
  onRemarksChange,
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
        <label className="block text-xl font-medium">Kategorie</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="mt-1 block w-full"
        >
          <option value="" disabled>
            Wähle eine Kategorie
          </option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      {selectedCategory && !['ferien', 'unfall', 'schule', 'dienst'].includes(selectedCategory) && (
        <div>
          <label className="block text-xl font-medium">
            Ausgewählte Kategorie: {categories.find(cat => cat.value === selectedCategory)?.label}
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={onInputChange}
            className="mt-1 block w-full"
            placeholder="Anzahl Stunden"
          />
          <textarea
            value={remarks}
            onChange={onRemarksChange}
            rows={3}
            className="mt-1 block w-full"
            placeholder="Bemerkungen"
          />
          {editEntry ? (
            <button
              type="submit"
              className="bg-yellow-500 text-white py-1 px-3 rounded mt-2"
            >
              Eintrag aktualisieren
            </button>
          ) : (
            <button
              type="submit"
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
