import { FieldTypeDefinition } from '../../../models/field.model';
import { RadioFieldComponent } from './radio-field.component';

export const RADIO_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'radio',
  label: 'Radio Group',
  icon: 'circle-on',
  component: RadioFieldComponent,
  defaultConfig: {
    label: 'Radio Group',
    required: false,
    orientation: 'vertical',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  settingsConfig: [
    { type: 'text', key: 'label', label: 'Label' },
    { type: 'checkbox', key: 'required', label: 'Required' },
    { type: 'options', key: 'options', label: 'Radio Options' },
    {
      type: 'select',
      key: 'orientation',
      label: 'Orientation',
      options: [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
      ],
    },
  ],
  generateCode: (field) => {
    let code =
      `      <div class="radio-group-field">\n` +
      `        <label class="radio-group-label">${field.label}</label>\n` +
      `        <mat-radio-group class="${field.orientation || 'vertical'}" [required]="${field.required}">\n`;

    if (field.options) {
      field.options.forEach((option) => {
        code += `          <mat-radio-button value="${option.value}">${option.label}</mat-radio-button>\n`;
      });
    } else {
      code +=
        `          <mat-radio-button value="option1">Option 1</mat-radio-button>\n` +
        `          <mat-radio-button value="option2">Option 2</mat-radio-button>\n` +
        `          <mat-radio-button value="option3">Option 3</mat-radio-button>\n`;
    }

    code += `        </mat-radio-group>\n` + `      </div>\n`;
    return code;
  },
};
