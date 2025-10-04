import { Component, input } from '@angular/core';
import { FormField } from '../../../models/field.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-textarea-field',
  imports: [CommonModule, FormsModule],
  templateUrl: './textarea-field.component.html',
  styleUrl: './textarea-field.component.css'
})
export class TextareaFieldComponent {
 field = input.required<FormField>();
}
