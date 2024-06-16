"use client";
import { ChangeEvent } from 'react';
import { categories } from './CategorySelect';

type EntryFormProps = {
  selectedCategory: string;
  inputValue: string;
  onCategoryChange: (category: string) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAddEntry: () => void;
  handleUpdateEntry: () => void;
  editEntry: boolean;
};

export default function EntryForm({
  selectedCategory,
  inputValue,
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
          <label className="block text-xl font-medium">{categories.find(cat => cat.value === selectedCategory)?.label}</label>
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
