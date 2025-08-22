import React from 'react';
import { Type, Mail, MessageSquare, ChevronDown, CheckSquare, Radio, Hash } from 'lucide-react';
import { FormField } from '../../types/form';

interface FieldTypeSelectorProps {
  onAddField: (type: FormField['type']) => void;
}

const fieldTypes = [
  { type: 'text' as const, label: 'Text Input', icon: Type },
  { type: 'email' as const, label: 'Email', icon: Mail },
  { type: 'textarea' as const, label: 'Textarea', icon: MessageSquare },
  { type: 'select' as const, label: 'Dropdown', icon: ChevronDown },
  { type: 'checkbox' as const, label: 'Checkbox', icon: CheckSquare },
  { type: 'radio' as const, label: 'Radio Button', icon: Radio },
  { type: 'number' as const, label: 'Number', icon: Hash },
];

export function FieldTypeSelector({ onAddField }: FieldTypeSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Form Fields</h3>
      <div className="grid grid-cols-2 gap-3">
        {fieldTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onAddField(type)}
            className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm"
          >
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}