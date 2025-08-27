import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldOptionsComponent } from './field-options/field-options.component';
import { FormService } from '../../services/form.service';
import { FieldTypesService } from '../../services/field-types.service';
import { FormField } from '../../models/field.model';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-field-settings',
  imports: [ CommonModule,
    FormsModule,
    FieldOptionsComponent,DropdownModule,FloatLabelModule,InputTextModule,CheckboxModule],
  templateUrl: './field-settings.component.html',
  styleUrl: './field-settings.component.css'
})
export class FieldSettingsComponent {
 formService = inject(FormService);
  fieldRegistry = inject(FieldTypesService);

  fieldSettings = computed(() => {
    const field = this.formService.selectedField();
    if (!field) return [];

    const fieldDef = this.fieldRegistry.getFieldType(field.type);
    return fieldDef?.settingsConfig || [];
  });

  fieldValues = computed(() => {
    const field = this.formService.selectedField();
    if (!field) return {};
    return field as any;
  });

  updateField(fieldId: string, key: string, value: any) {
    const update: Record<string, any> = {};
    update[key] = value;
    this.formService.updateField(fieldId, update);
  }

  updateFieldOptions(field: FormField, newOptions: any[]) {
    this.formService.updateField(field.id, { options: newOptions });
  }
}
