import { FieldTypeDefinition } from '../../../models/field.model';
import { SelectFieldComponent } from './select-field.component';

export const SELECT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'select',
  label: 'Dropdown',
  icon: 'chevron-down',
  component: SelectFieldComponent,
  defaultConfig: {
    label: 'Select',
    required: false,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  settingsConfig: [
    { type: 'text', key: 'label', label: 'Label' },
    { type: 'checkbox', key: 'required', label: 'Required' },
    { type: 'options', key: 'options', label: 'Dropdown Options' },
  ],
  generateCode: (field) => {
    let code =
      `      <mat-form-field appearance="outline" class="w-full">\n` +
      `        <mat-label>${field.label}</mat-label>\n` +
      `        <mat-select [required]="${field.required}">\n`;

    if (field.options) {
      field.options.forEach((option) => {
        code += `          <mat-option value="${option.value}">${option.label}</mat-option>\n`;
      });
    } else {
      code +=
        `          <mat-option value="option1">Option 1</mat-option>\n` +
        `          <mat-option value="option2">Option 2</mat-option>\n` +
        `          <mat-option value="option3">Option 3</mat-option>\n`;
    }

    code += `        </mat-select>\n` + `      </mat-form-field>\n`;
    return code;
  },
};
