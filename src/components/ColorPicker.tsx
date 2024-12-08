
const COLORS = [
  { name: 'red', value: '#EF4444' },
  { name: 'blue', value: '#3B82F6' },
  { name: 'green', value: '#10B981' },
  { name: 'yellow', value: '#F59E0B' },
  { name: 'purple', value: '#8B5CF6' },
  { name: 'orange', value: '#F97316' },
  { name: 'pink', value: '#EC4899' },
  { name: 'teal', value: '#14B8A6' },
  { name: 'indigo', value: '#6366F1' },
  { name: 'cyan', value: '#06B6D4' },
  { name: 'lime', value: '#84CC16' },
  { name: 'amber', value: '#FBBF24' },
  { name: 'rose', value: '#F43F5E' },
  { name: 'violet', value: '#A855F7' },
  { name: 'fuchsia', value: '#D946EF' },
  { name: 'sky', value: '#0EA5E9' },
  { name: 'emerald', value: '#059669' },
  { name: 'slate', value: '#64748B' },
  { name: 'neutral', value: '#9CA3AF' },
  { name: 'stone', value: '#78716C' }
];


interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2">
      {COLORS.map((color) => (
        <button
          key={color.name}
          type="button"
          className={`w-6 h-6 rounded-full ${
            selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
          }`}
          style={{ backgroundColor: color.value }}
          onClick={() => onChange(color.value)}
          aria-label={`Select ${color.name} color`}
        />
      ))}
    </div>
  );
}