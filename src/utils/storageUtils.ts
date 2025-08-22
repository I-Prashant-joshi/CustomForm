import { FormResponse } from '../types/form';

const STORAGE_KEY = 'formcraft_responses';

export function saveFormResponse(response: FormResponse): void {
  try {
    const existingResponses = getFormResponses();
    const updatedResponses = [...existingResponses, response];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResponses));
  } catch (error) {
    console.error('Error saving form response:', error);
  }
}

export function getFormResponses(): FormResponse[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading form responses:', error);
    return [];
  }
}

export function getFormResponsesByFormId(formId: string): FormResponse[] {
  const allResponses = getFormResponses();
  return allResponses.filter(response => response.form_id === formId);
}

export function clearFormResponses(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing form responses:', error);
  }
}

export function deleteFormResponse(responseId: string): void {
  try {
    const existingResponses = getFormResponses();
    const updatedResponses = existingResponses.filter(response => response.id !== responseId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResponses));
  } catch (error) {
    console.error('Error deleting form response:', error);
  }
}