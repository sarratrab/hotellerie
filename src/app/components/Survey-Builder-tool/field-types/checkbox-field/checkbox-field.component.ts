import { Component, input } from '@angular/core';

import { CheckboxModule } from 'primeng/checkbox'; 
import { FormsModule } from '@angular/forms';
import { FormField } from '../../../../models/field.model';
@Component({
  selector: 'app-checkbox-field',
  imports: [CheckboxModule,FormsModule],
  templateUrl: './checkbox-field.component.html',
  styleUrl: './checkbox-field.component.css'
})
export class CheckboxFieldComponent {
 field = input.required<FormField>();
}
