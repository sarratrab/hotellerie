import { Component, input } from '@angular/core';
import { FormField } from '../../../models/field.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-buttons-field',
  imports: [ButtonModule],
  templateUrl: './buttons-field.component.html',
  styleUrl: './buttons-field.component.css'
})
export class ButtonsFieldComponent {
field = input.required<FormField>();
}
