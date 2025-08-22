import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Form, FormField } from '../../types/form';
import { createDefaultField } from '../../utils/formUtils';
import { FieldTypeSelector } from './FieldTypeSelector';
import { FieldEditor } from './FieldEditor';
import { StyleEditor } from './StyleEditor';
import { FormPreview } from './FormPreview';
import { useFormContext } from '../../contexts/FormContext';

interface FormBuilderProps {
  form: Form | null;
  onSave: (form: Form) => void;
  onBack: () => void;
}

export function FormBuilder({ form, onSave, onBack }: FormBuilderProps) {
  const { selectedField, setSelectedField, previewMode, setPreviewMode } = useFormContext();
  const [currentForm, setCurrentForm] = useState<Form>(
    form || {
      id: '',
      title: 'New Form',
      description: '',
      fields: [],
      styling: {
        backgroundColor: '#F8FAFC',
        primaryColor: '#3B82F6',
        textColor: '#1F2937',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '8px',
        spacing: '24px',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    }
  );

  const handleAddField = (type: FormField['type']) => {
    const newField = createDefaultField(type);
    const updatedForm = {
      ...currentForm,
      fields: [...currentForm.fields, newField],
      updated_at: new Date().toISOString(),
    };
    setCurrentForm(updatedForm);
    setSelectedField(newField);
  };

  const handleUpdateField = (updatedField: FormField) => {
    const updatedForm = {
      ...currentForm,
      fields: currentForm.fields.map(field =>
        field.id === updatedField.id ? updatedField : field
      ),
      updated_at: new Date().toISOString(),
    };
    setCurrentForm(updatedForm);
    setSelectedField(updatedField);
  };

  const handleDeleteField = (fieldId: string) => {
    const updatedForm = {
      ...currentForm,
      fields: currentForm.fields.filter(field => field.id !== fieldId),
      updated_at: new Date().toISOString(),
    };
    setCurrentForm(updatedForm);
    setSelectedField(null);
  };

  const handleUpdateForm = (updates: Partial<Form>) => {
    const updatedForm = {
      ...currentForm,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    setCurrentForm(updatedForm);
  };

  const handleSave = () => {
    if (!currentForm.title.trim()) {
      alert('Please enter a form title');
      return;
    }
    onSave(currentForm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <input
                  type="text"
                  value={currentForm.title}
                  onChange={(e) => handleUpdateForm({ title: e.target.value })}
                  className="text-xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0 "
                  placeholder="Form Title"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save className="w-5 h-5" />
              Save Form
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <textarea
            value={currentForm.description || ''}
            onChange={(e) => handleUpdateForm({ description: e.target.value })}
            placeholder="Enter a description for your form (optional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {!previewMode && (
              <>
                <FieldTypeSelector onAddField={handleAddField} />
                {selectedField && (
                  <FieldEditor
                    field={selectedField}
                    onUpdate={handleUpdateField}
                    onDelete={handleDeleteField}
                  />
                )}
                <StyleEditor
                  styling={currentForm.styling}
                  onUpdate={(styling) => handleUpdateForm({ styling })}
                />
              </>
            )}
          </div>

          <div className="lg:col-span-3">
            <FormPreview
              form={currentForm}
              previewMode={previewMode}
              onTogglePreview={() => setPreviewMode(!previewMode)}
            />

            {!previewMode && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Form Fields</h4>
                {currentForm.fields.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No fields added yet. Use the field selector to add your first field.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {currentForm.fields.map((field, index) => (
                      <button
                        key={field.id}
                        onClick={() => setSelectedField(field)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedField?.id === field.id
                            ? 'bg-blue-50 border-2 border-blue-200'
                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">{field.label}</span>
                            <span className="text-sm text-gray-500 ml-2">({field.type})</span>
                          </div>
                          <span className="text-sm text-gray-400">#{index + 1}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}