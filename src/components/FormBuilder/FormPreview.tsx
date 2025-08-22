import React, { useState } from 'react';
import { Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Form } from '../../types/form';
import { FormRenderer } from '../FormRenderer/FormRenderer';
import { PublicFormRenderer } from '../FormRenderer/PublicFormRenderer';

interface FormPreviewProps {
  form: Form;
  previewMode: boolean;
  onTogglePreview: () => void;
}

export function FormPreview({ form, previewMode, onTogglePreview }: FormPreviewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showPublicView, setShowPublicView] = useState(false);

  const handleResponseChange = (fieldId: string, value: any) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (formResponses: Record<string, any>) => {
    console.log('Preview submission:', formResponses);
    alert('Preview submission successful!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Form Preview</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPublicView(!showPublicView)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {showPublicView ? 'Builder View' : 'Public View'}
          </button>
        </div>
        <button
          onClick={onTogglePreview}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            previewMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {previewMode ? 'Edit Mode' : 'Preview Mode'}
        </button>
      </div>

      <div className="p-6">
        {form.fields.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Eye className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500">No fields added yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Add form fields to see the preview
            </p>
          </div>
        ) : (
          showPublicView ? (
            <PublicFormRenderer form={form} />
          ) : (
          <FormRenderer
            form={form}
            responses={responses}
            onResponseChange={handleResponseChange}
            onSubmit={handleSubmit}
            isPreview={true}
          />
          )
        )}
      </div>
    </div>
  );
}