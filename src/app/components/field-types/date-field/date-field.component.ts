import { Component, input } from '@angular/core';
import { FormField } from '../../../models/field.model';
import { DatePickerModule } from 'primeng/datepicker';
@Component({
  selector: 'app-date-field',
  imports: [DatePickerModule],
  templateUrl: './date-field.component.html',
  styleUrl: './date-field.component.css'
})
export class DateFieldComponent {
 field = input.required<FormField>();
}
