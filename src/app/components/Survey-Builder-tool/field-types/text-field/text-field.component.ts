import { Component, input } from '@angular/core';
import { FormField } from '../../../../models/field.model';


@Component({
  selector: 'app-text-field',
  imports: [],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.css'
})
export class TextFieldComponent {
field = input.required<FormField>();
}
