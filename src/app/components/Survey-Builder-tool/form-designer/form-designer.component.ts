import { Component } from '@angular/core';
import { FormElementsMenuComponent } from "../form-elements-menu/form-elements-menu.component";
import { MainCanvasComponent } from "../main-canvas/main-canvas.component";
import { FieldSettingsComponent } from "../field-settings/field-settings.component";
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FormsModule } from '@angular/forms';
import { CardModule, Card } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-designer',
  imports: [FormElementsMenuComponent, MainCanvasComponent, FieldSettingsComponent, DragDropModule, DropdownModule,CommonModule, FormsModule],
  templateUrl: './form-designer.component.html',
  styleUrl: './form-designer.component.css'
})
export class FormDesignerComponent {



}
