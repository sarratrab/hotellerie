import { Component, input, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { FormFieldPreviewComponent } from '../form-field-preview/form-field-preview.component';
import { FormService } from '../../../../services/form.service';
import { FormField } from '../../../../models/field.model';


@Component({
  selector: 'app-form-field',
  imports: [
    TitleCasePipe,
    FormFieldPreviewComponent,],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css'
})
export class FormFieldComponent {
 formService = inject(FormService);
  field = input.required<FormField>();

  onDelete(event: Event) {
    event.stopPropagation();
    this.formService.deleteField(this.field().id);
  }
}
