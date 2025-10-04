
import { FieldTypeDefinition } from '../../../../models/field.model';
import { CheckboxFieldComponent } from './checkbox-field.component';

export const CHECKBOX_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'checkbox',
  label: 'Checkbox',
  icon: 'check_box',
  component: CheckboxFieldComponent,
  defaultConfig: {
    label: 'Checkbox',
    required: false,
  },
  settingsConfig: [
    { type: 'text', key: 'label', label: 'Label' },
    { type: 'checkbox', key: 'required', label: 'Required' },
  ],
  generateCode: (field) =>
    `      <mat-checkbox [required]="${field.required}">${field.label}</mat-checkbox>\n`,
};
