import { Component, input } from '@angular/core';

import { DatePickerModule } from 'primeng/datepicker';
import { FormField } from '../../../../models/field.model';
@Component({
  selector: 'app-date-field',
  imports: [DatePickerModule],
  templateUrl: './date-field.component.html',
  styleUrl: './date-field.component.css'
})
export class DateFieldComponent {
 field = input.required<FormField>();
}
