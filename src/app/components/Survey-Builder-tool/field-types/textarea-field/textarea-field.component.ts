import { Component, input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField } from '../../../../models/field.model';
@Component({
  selector: 'app-textarea-field',
  imports: [CommonModule, FormsModule],
  templateUrl: './textarea-field.component.html',
  styleUrl: './textarea-field.component.css'
})
export class TextareaFieldComponent {
 field = input.required<FormField>();
}
