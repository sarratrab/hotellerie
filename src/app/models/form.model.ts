/**
 * Form-related interfaces
 */

import { FormField } from './field.model';

export interface FormRow {
  id: string;
  fields: FormField[];
}
