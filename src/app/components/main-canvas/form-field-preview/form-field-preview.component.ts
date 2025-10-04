import { Component, input, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField } from '../../../models/field.model';
import { FieldTypesService } from '../../../services/field-types.service';

@Component({
  selector: 'app-form-field-preview',
  imports: [CommonModule,
    FormsModule,
   ],
  templateUrl: './form-field-preview.component.html',
  styleUrl: './form-field-preview.component.css'
})
export class FormFieldPreviewComponent {
 field = input.required<FormField>();
  fieldRegistry = inject(FieldTypesService);

  getFieldComponent(type: string) {
    const fieldDef = this.fieldRegistry.getFieldType(type);
    return fieldDef?.component || null;
  }

  @Output() valueChange = new EventEmitter<{ fieldId: string, value: any }>();
  onValueChange(value: any) {
    this.field().answer = value; // ✅ save locally
    this.valueChange.emit({ fieldId: this.field().id, value }); // ✅ notify parent
  }
}
