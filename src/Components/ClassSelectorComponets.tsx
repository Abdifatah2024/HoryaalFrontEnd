import React from 'react';

interface ClassSelectorProps {
  value: number;
  onChange: (id: number) => void;
  excludeClass?: number;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ value, onChange, excludeClass }) => {
  // In a real app, you would fetch these from your API
  const classes  = [
    { id: 1, name: "1A", grade: 1 },
    { id: 2, name: "1B", grade: 1 },
    { id: 3, name: "1C", grade: 1 },
    { id: 4, name: "1D", grade: 1 },
    { id: 5, name: "1E", grade: 1 },
    { id: 6, name: "1G", grade: 1 },
    { id: 7, name: "2A", grade: 2 },
    { id: 8, name: "2B", grade: 2 },
    { id: 9, name: "2C", grade: 2 },
    { id: 10, name: "2D", grade: 2 },
    { id: 11, name: "2E", grade: 2 },
    { id: 12, name: "2F", grade: 2 },
    { id: 13, name: "3A", grade: 3 },
    { id: 14, name: "3B", grade: 3 },
    { id: 15, name: "3C", grade: 3 },
    { id: 16, name: "3D", grade: 3 },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full p-2 border rounded"
    >
      {classes
        .filter(cls => cls.id !== excludeClass)
        .map(cls => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
    </select>
  );
};

export default ClassSelector;