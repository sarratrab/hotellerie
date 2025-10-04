import { Component, input } from '@angular/core';

import { DropdownModule } from 'primeng/dropdown';
import { FormField } from '../../../../models/field.model';

@Component({
  selector: 'app-select-field',
  imports: [DropdownModule],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.css'
})
export class SelectFieldComponent {
field = input.required<FormField>();
}
