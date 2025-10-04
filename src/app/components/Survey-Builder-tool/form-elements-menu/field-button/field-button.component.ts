import { Component, input, signal } from '@angular/core';

import {CdkDrag, DragDropModule} from '@angular/cdk/drag-drop';

import { NgClass } from '@angular/common';
import { FieldTypeDefinition } from '../../../../models/field.model';
@Component({
  selector: 'app-field-button',
  imports: [CdkDrag,DragDropModule,NgClass],
  templateUrl: './field-button.component.html',
  styleUrl: './field-button.component.css'
})
export class FieldButtonComponent {
  field = input.required<FieldTypeDefinition>();
  whileDragging = signal(false);
}