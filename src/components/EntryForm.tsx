"use client";
import { ChangeEvent } from 'react';
import { categories } from './CategorySelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

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
  onCancel: () => void;
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
  editEntry,
  onCancel,
}: EntryFormProps) {
  return (
    <div className="relative">
      <h2 className="text-xl mb-4">Eintrag bearbeiten</h2>
      
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
            className="mt-1 block w-full border text-lg"
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
            <label className="block text-xl font-medium">Stunden</label>
            <input
              type="number"
              value={inputValue}
              onChange={onInputChange}
              className="mt-1 block w-full border text-lg"
              placeholder="Anzahl Stunden"
            />
          </div>
        )}
        <div className="flex mt-4 space-x-2">
          
          <button
            type="submit"
            className="bg-customYellow-200 text-black py-2 px-4 rounded flex-grow"
            title={editEntry ? "Aktualisieren" : "Eintrag hinzufügen"}
            style={{ flexBasis: '70%' }}
          >
            <FontAwesomeIcon icon={faSave} size="lg" />
          </button>
        </div>
      </form>
    </div>
  );
}
