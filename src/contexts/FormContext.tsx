import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Form, FormField } from '../types/form';

interface FormContextType {
  currentForm: Form | null;
  setCurrentForm: (form: Form | null) => void;
  selectedField: FormField | null;
  setSelectedField: (field: FormField | null) => void;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [currentForm, setCurrentForm] = useState<Form | null>(null);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <FormContext.Provider value={{
      currentForm,
      setCurrentForm,
      selectedField,
      setSelectedField,
      previewMode,
      setPreviewMode,
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}