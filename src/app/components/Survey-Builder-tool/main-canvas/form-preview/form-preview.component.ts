import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';


import { FormFieldPreviewComponent } from "../form-field-preview/form-field-preview.component";
import { FormService } from '../../../../services/form.service';

@Component({
  selector: 'app-form-preview',
  imports: [CommonModule, FormFieldPreviewComponent],
  templateUrl: './form-preview.component.html',
  styleUrl: './form-preview.component.css'
})
export class FormPreviewComponent {
 formService = inject(FormService);
}
