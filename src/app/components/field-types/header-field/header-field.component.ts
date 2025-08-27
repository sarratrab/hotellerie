import { Component, input } from '@angular/core';
import { FormField } from '../../../models/field.model';

@Component({
  selector: 'app-header-field',
  imports: [],
  templateUrl: './header-field.component.html',
  styleUrl: './header-field.component.css'
})
export class HeaderFieldComponent {
field = input.required<FormField>();
}
