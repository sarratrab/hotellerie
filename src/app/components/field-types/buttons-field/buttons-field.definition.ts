import { FieldTypeDefinition } from '../../../models/field.model';
import { ButtonsFieldComponent } from './buttons-field.component';

export const BUTTONS_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'buttons',
  label: 'Button Group',
  icon: 'stop',
  component: ButtonsFieldComponent,
  defaultConfig: {
    label: 'Submit',
    showCancelButton: true,
    alignment: 'right',
  },
  settingsConfig: [
    { type: 'text', key: 'label', label: 'Button Text' },
    {
      type: 'checkbox',
      key: 'showCancelButton',
      label: 'Show Cancel Button',
    },
    {
      type: 'select',
      key: 'alignment',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
    },
  ],
  generateCode: (field) => {
    const alignment = field.alignment || 'right';
    let code = `      <div style="text-align: ${alignment}">\n`;

    if (field.showCancelButton) {
      code += `        <button mat-button type="button">Cancel</button>\n`;
    }

    code +=
      `        <button mat-flat-button type="submit">${field.label}</button>\n` +
      `      </div>\n`;

    return code;
  },
};
