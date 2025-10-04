import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-duplicate-template-dialog',
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './duplicate-template-dialog.component.html',
  styleUrl: './duplicate-template-dialog.component.css'
})
export class DuplicateTemplateDialogComponent {
  newName: string = '';

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  confirm() {
    this.ref.close(this.newName);
  }

  cancel() {
    this.ref.close(null);
  }
}
