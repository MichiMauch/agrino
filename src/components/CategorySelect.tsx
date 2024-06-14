import React from 'react';

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

type CategorySelectProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

const CategorySelect: React.FC<CategorySelectProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div>
      <label className="block text-xl font-medium">Kategorie</label>
      <select
        value={selectedCategory}
        onChange={(e) => onSelectCategory(e.target.value)}
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
  );
};

export default CategorySelect;
