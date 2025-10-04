
import { FieldTypeDefinition } from '../../../../models/field.model';
import { TextareaFieldComponent } from './textarea-field.component';

export const TEXTAREA_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'textarea',
  label: 'Text Area',
  icon: 'notes',
  component: TextareaFieldComponent,
  defaultConfig: {
    label: 'Text Area',
    placeholder: 'Enter text',
    required: false,
  },
  settingsConfig: [
    { type: 'text', key: 'label', label: 'Label' },
    { type: 'text', key: 'placeholder', label: 'Placeholder' },
    { type: 'checkbox', key: 'required', label: 'Required' },
  ],
  generateCode: (field) => `
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>${field.label}</mat-label>
        <textarea matInput [required]="${field.required}" placeholder="${field.placeholder}"></textarea>
      </mat-form-field>
    `,
};
