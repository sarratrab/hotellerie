/**
 * Field-related interfaces
 */

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder: string;
  inputType?: 'text' | 'number' | 'email' | 'tel';
  options?: { label: string; value: string }[];
  subheading?: string;
  showCancelButton?: boolean;
  alignment?: 'left' | 'right';
  orientation?: 'horizontal' | 'vertical';
  answer?: string | string[];   // <-- add this
}

export interface FieldTypeDefinition {
  type: string;
  label: string;
  icon: string;
  component: any;
  defaultConfig: any;
  settingsConfig: FieldSettingDefinition[];
  generateCode: (field: FormField) => string;
}

export interface FieldSettingDefinition {
  type: 'text' | 'checkbox' | 'select' | 'options';
  key: string;
  label: string;
  options?: OptionItem[];
}

export interface OptionItem {
  label: string;
  value: string;
}
