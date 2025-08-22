import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Form, FormResponse } from '../../types/form';
import { validateField } from '../../utils/formUtils';
import { saveFormResponse } from '../../utils/storageUtils';
import { FormFieldRenderer } from './FormFieldRenderer';

interface PublicFormRendererProps {
  form: Form;
}

export function PublicFormRenderer({ form }: PublicFormRendererProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleResponseChange = (fieldId: string, value: any) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
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
        const formResponse: FormResponse = {
          id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          form_id: form.id,
          responses: responses,
          submitted_at: new Date().toISOString(),
        };

        saveFormResponse(formResponse);
        
        setIsSubmitted(true);
        setResponses({});
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitError('Failed to submit form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmitAnother = () => {
    setIsSubmitted(false);
    setResponses({});
    setErrors({});
    setSubmitError(null);
  };

  const formStyles = {
    fontFamily: form.styling.fontFamily,
    backgroundColor: form.styling.backgroundColor,
    color: form.styling.textColor,
    '--primary-color': form.styling.primaryColor,
    '--border-radius': form.styling.borderRadius,
    '--field-spacing': form.styling.spacing,
  } as React.CSSProperties;

  if (isSubmitted) {
    return (
      <div style={formStyles} className="p-6 rounded-lg min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600">
              Your response has been submitted successfully.
            </p>
          </div>
          <button
            onClick={handleSubmitAnother}
            className="px-6 py-3 font-semibold text-white rounded-lg transition-colors"
            style={{
              backgroundColor: form.styling.primaryColor,
              borderRadius: form.styling.borderRadius,
            }}
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={formStyles} className="p-6 rounded-lg min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{form.title}</h2>
          {form.description && (
            <p className="text-lg text-gray-600">{form.description}</p>
          )}
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id} style={{ marginBottom: form.styling.spacing }}>
              <FormFieldRenderer
                field={field}
                value={responses[field.id]}
                onChange={(value) => handleResponseChange(field.id, value)}
                error={errors[field.id]}
                styling={form.styling}
              />
            </div>
          ))}

          {form.fields.length > 0 && (
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 font-semibold text-white rounded-lg transition-colors text-lg"
                style={{
                  backgroundColor: form.styling.primaryColor,
                  borderRadius: form.styling.borderRadius,
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}