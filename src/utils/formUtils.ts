import { FormField } from '../types/form';

export function generateFieldId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createDefaultField(type: FormField['type']): FormField {
  const baseField: FormField = {
    id: generateFieldId(),
    type,
    label: getDefaultLabel(type),
    required: false,
  };

  switch (type) {
    case 'text':
    case 'email':
    case 'number':
      return {
        ...baseField,
        placeholder: `Enter your ${getDefaultLabel(type).toLowerCase()}`,
      };
    case 'textarea':
      return {
        ...baseField,
        placeholder: 'Enter your message here...',
      };
    case 'select':
    case 'radio':
      return {
        ...baseField,
        options: ['Option 1', 'Option 2', 'Option 3'],
      };
    case 'checkbox':
      return {
        ...baseField,
        options: ['Checkbox option'],
      };
    default:
      return baseField;
  }
}

function getDefaultLabel(type: FormField['type']): string {
  const labels = {
    text: 'Text Field',
    email: 'Email Address',
    textarea: 'Message',
    select: 'Select Option',
    checkbox: 'Checkbox',
    radio: 'Radio Button',
    number: 'Number',
  };
  return labels[type];
}

export function validateField(field: FormField, value: any): string | null {
  if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${field.label} is required`;
  }

  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
  }

  if (field.validation?.minLength && value && value.length < field.validation.minLength) {
    return `${field.label} must be at least ${field.validation.minLength} characters`;
  }

  if (field.validation?.maxLength && value && value.length > field.validation.maxLength) {
    return `${field.label} must be no more than ${field.validation.maxLength} characters`;
  }

  return null;
}