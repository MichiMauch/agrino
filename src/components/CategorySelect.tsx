import React from 'react';

export const categories = [
  { value: 'milchvieh', label: 'Milchvieh' },
  { value: 'mutterkuhe', label: 'Mutterkühe' },
  { value: 'ackerbau', label: 'Ackerbau' },
  { value: 'biogas', label: 'Biogas' },
  { value: 'robbergMaxi', label: 'Rebberg Märxli' },
  { value: 'oko', label: 'Öko' },
  { value: 'pferdepension', label: 'Pferdepension' },
  { value: 'prodVerarb', label: 'Prod.Verarb.' },
  { value: 'schuUndBau', label: 'Schub und Gäste' },
  { value: 'garten', label: 'Maschinen/Gebäude' },
  { value: 'administration', label: 'Administration' },
  { value: 'nebenverwer', label: 'Nebenerwerb' },
  { value: 'bau', label: 'Bau' },
  { value: 'ferienFrei', label: 'Ferien/Frei' },
  { value: 'schule', label: 'Schule' },
  { value: 'unfallKrankheit', label: 'Unfall/Krankheit' },
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
