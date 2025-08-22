import React, { useState } from 'react';
import { ArrowLeft, Download, Calendar, User } from 'lucide-react';
import { Form, FormResponse } from '../../types/form';

interface ResponseViewerProps {
  form: Form;
  responses: FormResponse[];
  onBack: () => void;
}

export function ResponseViewer({ form, responses, onBack }: ResponseViewerProps) {
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    if (responses.length === 0) return;

    const headers = ['Submission Date', ...form.fields.map(field => field.label)];
    const csvContent = [
      headers.join(','),
      ...responses.map(response => [
        new Date(response.submitted_at).toISOString(),
        ...form.fields.map(field => {
          const value = response.responses[field.id];
          if (Array.isArray(value)) return `"${value.join(', ')}"`;
          return `"${value || ''}"`;
        })
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{form.title}</h1>
                <p className="text-sm text-gray-500">{responses.length} responses</p>
              </div>
            </div>

            {responses.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {responses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <User className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No responses yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Once people start submitting your form, their responses will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Response List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">All Responses</h3>
                </div>
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {responses.map((response) => (
                    <button
                      key={response.id}
                      onClick={() => setSelectedResponse(response)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedResponse?.id === response.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(response.submitted_at)}
                      </div>
                      <p className="text-sm text-gray-900 truncate">
                        Response #{responses.indexOf(response) + 1}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Response Detail */}
            <div className="lg:col-span-2">
              {selectedResponse ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      Submitted on {formatDate(selectedResponse.submitted_at)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Response #{responses.indexOf(selectedResponse) + 1}
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {form.fields.map((field) => {
                      const value = selectedResponse.responses[field.id];
                      return (
                        <div key={field.id}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                          </label>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            {Array.isArray(value) ? (
                              <div className="space-y-1">
                                {value.map((item, index) => (
                                  <div key={index} className="text-gray-900">• {item}</div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-900">{value || 'No response'}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a response to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}