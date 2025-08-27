import { FieldTypeDefinition } from '../../../models/field.model';
import { HeaderFieldComponent } from './header-field.component';

export const HEADER_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'header',
  label: 'Heading',
  icon: 'font',
  component: HeaderFieldComponent,
  defaultConfig: {
    label: 'Section Title',
    subheading: 'Section description goes here',
  },
  settingsConfig: [
    { type: 'text', key: 'label', label: 'Heading' },
    { type: 'text', key: 'subheading', label: 'Subheading' },
  ],
  generateCode: (field) =>
    `      <h2 class="form-header">${field.label}</h2>\n` +
    `      <p class="form-subheading">${field.subheading || ''}</p>\n`,
};
