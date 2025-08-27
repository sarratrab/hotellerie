import { Component, input } from '@angular/core';
import { FormField } from '../../../models/field.model';
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
  selector: 'app-radio-field',
  imports: [RadioButtonModule],
  templateUrl: './radio-field.component.html',
  styleUrl: './radio-field.component.css'
})
export class RadioFieldComponent {
 field = input.required<FormField>();
}
