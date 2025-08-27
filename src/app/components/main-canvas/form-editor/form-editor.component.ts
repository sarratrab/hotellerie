import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { FormService } from '../../../services/form.service';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FieldTypeDefinition, FormField } from '../../../models/field.model';


@Component({
  selector: 'app-form-editor',
  imports: [ CommonModule,
    DragDropModule,
    FormFieldComponent,
    ],
  templateUrl: './form-editor.component.html',
  styleUrl: './form-editor.component.css'
})
export class FormEditorComponent {
 formService = inject(FormService);

  onDropInRow(event: CdkDragDrop<string>, rowId: string) {
    // Case 1: Dropping from the sidebar (creating a new field)
    if (event.previousContainer.data === 'field-selector') {
      const fieldType = event.item.data as FieldTypeDefinition;
      const newField: FormField = {
        id: crypto.randomUUID(),
        type: fieldType.type,
        ...fieldType.defaultConfig,
      };

      this.formService.addField(newField, rowId, event.currentIndex);
      return;
    }

    // Case 2: Moving a field across or within rows in the canvas
    const dragData = event.item.data as FormField;
    const previousRowId = event.previousContainer.data as string;
    this.formService.moveField(
      dragData.id,
      previousRowId,
      rowId,
      event.currentIndex,
    );
  }
}


