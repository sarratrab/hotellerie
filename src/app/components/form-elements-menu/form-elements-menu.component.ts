import { Component, inject } from '@angular/core';
import { FieldTypesService } from '../../services/field-types.service';
import { FieldTypeDefinition } from '../../models/field.model';
import { FieldButtonComponent } from "./field-button/field-button.component";
import { CommonModule } from '@angular/common';

import {CdkDrag, DragDropModule} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form-elements-menu',
  imports: [FieldButtonComponent, CommonModule, DragDropModule, FieldButtonComponent],
  templateUrl: './form-elements-menu.component.html',
  styleUrl: './form-elements-menu.component.css'
})
export class FormElementsMenuComponent {
  private fieldTypesService = inject(FieldTypesService);

  fieldTypes: FieldTypeDefinition[] = this.fieldTypesService.getAllFieldTypes();

  noDropAllowed(item: CdkDrag<any>): boolean {
    return false;
  }
}
