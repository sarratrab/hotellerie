
import { FieldTypeDefinition } from '../../../../models/field.model';
import { TextFieldComponent } from './text-field.component';

export const TEXT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'text',
  label: 'Text Field',
  icon: 'pencil',
  component: TextFieldComponent,
  defaultConfig: {
    label: 'Text Field',
    placeholder: 'Enter text',
    required: false,
  },
  settingsConfig: [
    { type: 'text', key: 'label', label: 'Label' },
    { type: 'text', key: 'placeholder', label: 'Placeholder' },
    { type: 'checkbox', key: 'required', label: 'Required' },
    {
      type: 'select',
      key: 'inputType',
      label: 'Input Type',
      options: [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'email', label: 'Email' },
        { value: 'tel', label: 'Phone' },
      ],
    },
  ],
  generateCode: (field) => `
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>${field.label}</mat-label>
        <input matInput type="${field.inputType || 'text'}" [required]="${field.required}" placeholder="${field.placeholder}" />
      </mat-form-field>
    `,
};
