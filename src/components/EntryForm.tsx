"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

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
  { value: 'ferien', label: 'Ferien/Frei' },
  { value: 'unfall', label: 'Unfall/Krankheit' },
  { value: 'schule', label: 'Schule' },
  { value: 'dienst', label: 'Dienst' },
];

export default function EntryForm({ date, selectedCategory, inputValue, onDateChange, onCategoryChange, onInputChange, handleAddEntry, handleUpdateEntry, editEntry }) {
  return (
    <form className="space-y-4">
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
