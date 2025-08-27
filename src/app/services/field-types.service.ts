import { Injectable } from '@angular/core';
import { FieldTypeDefinition } from '../models/field.model';
import { BUTTONS_FIELD_DEFINITION } from '../components/field-types/buttons-field/buttons-field.definition';
import { TEXT_FIELD_DEFINITION } from '../components/field-types/text-field/text-field.definition';
import { TEXTAREA_FIELD_DEFINITION } from '../components/field-types/textarea-field/textarea-field.definition';
import { SELECT_FIELD_DEFINITION } from '../components/field-types/select-field/select-field.definition';
import { CHECKBOX_FIELD_DEFINITION } from '../components/field-types/checkbox-field/checkbox-field.definition';
import { RADIO_FIELD_DEFINITION } from '../components/field-types/radio-field/radio-field.definition';
import { DATE_FIELD_DEFINITION } from '../components/field-types/date-field/date-field.definition';
import { HEADER_FIELD_DEFINITION } from '../components/field-types/header-field/header-field.definition';

@Injectable({
  providedIn: 'root'
})
export class FieldTypesService {
private fieldTypes = new Map<string, FieldTypeDefinition>([
    ['text', TEXT_FIELD_DEFINITION],
    ['textarea', TEXTAREA_FIELD_DEFINITION],
    ['select', SELECT_FIELD_DEFINITION],
    ['checkbox', CHECKBOX_FIELD_DEFINITION],
    ['radio', RADIO_FIELD_DEFINITION],
    ['date', DATE_FIELD_DEFINITION],
    ['header', HEADER_FIELD_DEFINITION],
    ['buttons', BUTTONS_FIELD_DEFINITION],
  ]);

  getFieldType(type: string): FieldTypeDefinition | undefined {
    return this.fieldTypes.get(type);
  }

  getAllFieldTypes(): FieldTypeDefinition[] {
    return Array.from(this.fieldTypes.values());
  }
}
