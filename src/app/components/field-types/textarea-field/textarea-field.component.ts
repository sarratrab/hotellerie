import { Component, input } from '@angular/core';
import { FormField } from '../../../models/field.model';
@Component({
  selector: 'app-textarea-field',
  imports: [],
  templateUrl: './textarea-field.component.html',
  styleUrl: './textarea-field.component.css'
})
export class TextareaFieldComponent {
 field = input.required<FormField>();
}
