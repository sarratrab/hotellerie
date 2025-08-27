import { Component, input } from '@angular/core';
import { FormField } from '../../../models/field.model';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-select-field',
  imports: [DropdownModule],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.css'
})
export class SelectFieldComponent {
field = input.required<FormField>();
}
