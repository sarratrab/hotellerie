import { FieldTypeDefinition } from '../../../models/field.model';
import { DateFieldComponent } from './date-field.component';

export const DATE_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'date',
  label: 'Date Picker',
  icon: 'calendar',
  component: DateFieldComponent,
  defaultConfig: {
    label: 'Date',
    required: false,
  },
  settingsConfig: [
    { type: 'text', key: 'label', label: 'Label' },
    { type: 'checkbox', key: 'required', label: 'Required' },
  ],
  generateCode: (field) =>
    `      <mat-form-field appearance="outline" class="w-full">\n` +
    `        <mat-label>${field.label}</mat-label>\n` +
    `        <input matInput [matDatepicker]="picker${field.id}" [required]="${field.required}" />\n` +
    `        <mat-datepicker-toggle matIconSuffix [for]="picker${field.id}"></mat-datepicker-toggle>\n` +
    `        <mat-datepicker #picker${field.id}></mat-datepicker>\n` +
    `      </mat-form-field>\n`,
};
