import { Component, input, inject } from '@angular/core';
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
}
