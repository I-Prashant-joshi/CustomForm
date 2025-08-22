export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  styling: FormStyling;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface FormStyling {
  backgroundColor: string;
  primaryColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  spacing: string;
}

export interface FormResponse {
  id: string;
  form_id: string;
  responses: Record<string, any>;
  submitted_at: string;
}

export interface FormSubmission {
  form_id: string;
  responses: Record<string, any>;
}