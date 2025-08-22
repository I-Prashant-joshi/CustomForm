import React, { useState } from 'react';
import { FormProvider } from './contexts/FormContext';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { FormBuilder } from './components/FormBuilder/FormBuilder';
import { ResponseViewer } from './components/Responses/ResponseViewer';
import { Form, FormResponse } from './types/form';
import { getFormResponsesByFormId } from './utils/storageUtils';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [forms, setForms] = useState<Form[]>([]);
  const [currentForm, setCurrentForm] = useState<Form | null>(null);

  const handleCreateForm = () => {
    setCurrentForm(null);
    setActiveTab('builder');
  };

  const handleEditForm = (form: Form) => {
    setCurrentForm(form);
    setActiveTab('builder');
  };

  const handleDuplicateForm = (form: Form) => {
    const duplicatedForm: Form = {
      ...form,
      id: `form_${Date.now()}`,
      title: `${form.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setForms(prev => [...prev, duplicatedForm]);
  };

  const handleDeleteForm = (formId: string) => {
    setForms(prev => prev.filter(form => form.id !== formId));
  };

  const handleSaveForm = (form: Form) => {
    const formToSave = {
      ...form,
      id: form.id || `form_${Date.now()}`,
    };

    setForms(prev => {
      const existingIndex = prev.findIndex(f => f.id === formToSave.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = formToSave;
        return updated;
      } else {
        return [...prev, formToSave];
      }
    });

    setActiveTab('dashboard');
  };

  const handleViewResponses = (form: Form) => {
    setCurrentForm(form);
    setActiveTab('responses');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            forms={forms}
            onCreateForm={handleCreateForm}
            onEditForm={handleEditForm}
            onDuplicateForm={handleDuplicateForm}
            onDeleteForm={handleDeleteForm}
            onViewResponses={handleViewResponses}
          />
        );
      case 'builder':
        return (
          <FormProvider>
            <FormBuilder
              form={currentForm}
              onSave={handleSaveForm}
              onBack={() => setActiveTab('dashboard')}
            />
          </FormProvider>
        );
      case 'responses':
        if (currentForm) {
          const responses = getFormResponsesByFormId(currentForm.id);
          return (
          <ResponseViewer
            form={currentForm}
            responses={responses}
            onBack={() => setActiveTab('dashboard')}
          />
          );
        } else {
          return (
          <div>No form selected</div>
          );
        }
      default:
        return <Dashboard
          forms={forms}
          onCreateForm={handleCreateForm}
          onEditForm={handleEditForm}
          onDuplicateForm={handleDuplicateForm}
          onDeleteForm={handleDeleteForm}
          onViewResponses={handleViewResponses}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default App;