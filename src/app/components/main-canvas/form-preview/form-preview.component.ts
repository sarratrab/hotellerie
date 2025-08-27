import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { FormService } from '../../../services/form.service';
import { FormFieldPreviewComponent } from "../form-field-preview/form-field-preview.component";

@Component({
  selector: 'app-form-preview',
  imports: [CommonModule, FormFieldPreviewComponent],
  templateUrl: './form-preview.component.html',
  styleUrl: './form-preview.component.css'
})
export class FormPreviewComponent {
 formService = inject(FormService);
}
