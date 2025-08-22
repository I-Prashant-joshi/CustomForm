import React, { useState } from 'react';
import { Plus, Copy, Edit3, Trash2, Eye, BarChart3, Calendar, FileText } from 'lucide-react';
import { Form } from '../../types/form';
import { getFormResponsesByFormId } from '../../utils/storageUtils';

interface DashboardProps {
  forms: Form[];
  onCreateForm: () => void;
  onEditForm: (form: Form) => void;
  onDuplicateForm: (form: Form) => void;
  onDeleteForm: (formId: string) => void;
  onViewResponses: (form: Form) => void;
}

export function Dashboard({
  forms,
  onCreateForm,
  onEditForm,
  onDuplicateForm,
  onDeleteForm,
  onViewResponses
}: DashboardProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (formId: string) => {
    if (deleteConfirm === formId) {
      onDeleteForm(formId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(formId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Forms</h2>
          <p className="text-gray-600 mt-1">
            Create, manage, and analyze your forms
          </p>
        </div>
        <button
          onClick={onCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create New Form
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <FileText className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No forms created yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by creating your first form. Build beautiful, responsive forms 
            without any technical knowledge required.
          </p>
          <button
            onClick={onCreateForm}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Your First Form
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {form.description}
                    </p>
                  )}
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    form.is_active ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                  title={form.is_active ? 'Active' : 'Inactive'}
                />
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(form.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  {form.fields.length} fields • {getFormResponsesByFormId(form.id).length} responses
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditForm(form)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit form"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicateForm(form)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Duplicate form"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onViewResponses(form)}
                    className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="View responses"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteConfirm === form.id
                        ? 'text-white bg-red-600 hover:bg-red-700'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={deleteConfirm === form.id ? 'Click again to confirm' : 'Delete form'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}