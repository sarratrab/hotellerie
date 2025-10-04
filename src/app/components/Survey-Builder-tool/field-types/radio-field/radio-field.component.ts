import { Component, input } from '@angular/core';

import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { FormField } from '../../../../models/field.model';
@Component({
  selector: 'app-radio-field',
  imports: [FormsModule,RadioButtonModule],
  templateUrl: './radio-field.component.html',
  styleUrl: './radio-field.component.css'
})
export class RadioFieldComponent {
 field = input.required<FormField>();
  selectedValue: any;
}
