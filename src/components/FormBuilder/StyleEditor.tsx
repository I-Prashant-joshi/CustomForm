import React from 'react';
import { FormStyling } from '../../types/form';

interface StyleEditorProps {
  styling: FormStyling;
  onUpdate: (styling: FormStyling) => void;
}

const colorPresets = [
  { name: 'Blue', primary: '#3B82F6', background: '#F8FAFC' },
  { name: 'Green', primary: '#10B981', background: '#F0FDF4' },
  { name: 'Purple', primary: '#8B5CF6', background: '#FAF5FF' },
  { name: 'Orange', primary: '#F97316', background: '#FFF7ED' },
  { name: 'Pink', primary: '#EC4899', background: '#FDF2F8' },
  { name: 'Teal', primary: '#14B8A6', background: '#F0FDFA' },
];

const fontOptions = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
];

export function StyleEditor({ styling, onUpdate }: StyleEditorProps) {
  const updateStyling = (updates: Partial<FormStyling>) => {
    onUpdate({ ...styling, ...updates });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Styling</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => updateStyling({
                  primaryColor: preset.primary,
                  backgroundColor: preset.background,
                })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  styling.primaryColor === preset.primary
                    ? 'border-gray-900 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <span className="text-sm font-medium">{preset.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Family
          </label>
          <select
            value={styling.fontFamily}
            onChange={(e) => updateStyling({ fontFamily: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {fontOptions.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Border Radius
          </label>
          <select
            value={styling.borderRadius}
            onChange={(e) => updateStyling({ borderRadius: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="4px">Small (4px)</option>
            <option value="8px">Medium (8px)</option>
            <option value="12px">Large (12px)</option>
            <option value="16px">Extra Large (16px)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field Spacing
          </label>
          <select
            value={styling.spacing}
            onChange={(e) => updateStyling({ spacing: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="16px">Compact (16px)</option>
            <option value="24px">Normal (24px)</option>
            <option value="32px">Spacious (32px)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Primary Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={styling.primaryColor}
              onChange={(e) => updateStyling({ primaryColor: e.target.value })}
              className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={styling.primaryColor}
              onChange={(e) => updateStyling({ primaryColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="#3B82F6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}