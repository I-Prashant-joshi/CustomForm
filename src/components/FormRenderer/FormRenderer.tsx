import React, { useState } from 'react';
import { Form } from '../../types/form';
import { validateField } from '../../utils/formUtils';
import { FormFieldRenderer } from './FormFieldRenderer';

interface FormRendererProps {
  form: Form;
  responses: Record<string, any>;
  onResponseChange: (fieldId: string, value: any) => void;
  onSubmit: (responses: Record<string, any>) => void;
  isPreview?: boolean;
}

export function FormRenderer({
  form,
  responses,
  onResponseChange,
  onSubmit,
  isPreview = false
}: FormRendererProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    for (const field of form.fields) {
      const error = validateField(field, responses[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(responses);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const formStyles = {
    fontFamily: form.styling.fontFamily,
    backgroundColor: form.styling.backgroundColor,
    color: form.styling.textColor,
    '--primary-color': form.styling.primaryColor,
    '--border-radius': form.styling.borderRadius,
    '--field-spacing': form.styling.spacing,
  } as React.CSSProperties;

  return (
    <div style={formStyles} className="p-6 rounded-lg">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h2>
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id} style={{ marginBottom: form.styling.spacing }}>
              <FormFieldRenderer
                field={field}
                value={responses[field.id]}
                onChange={(value) => {
                  onResponseChange(field.id, value);
                  if (errors[field.id]) {
                    setErrors(prev => ({ ...prev, [field.id]: '' }));
                  }
                }}
                error={errors[field.id]}
                styling={form.styling}
              />
            </div>
          ))}

          {form.fields.length > 0 && (
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 font-semibold text-white rounded-lg transition-colors"
                style={{
                  backgroundColor: form.styling.primaryColor,
                  borderRadius: form.styling.borderRadius,
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? 'Submitting...' : isPreview ? 'Submit (Preview)' : 'Submit'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}