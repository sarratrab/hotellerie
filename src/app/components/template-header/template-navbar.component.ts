import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-template-header',
  imports: [],
  templateUrl: './template-navbar.component.html',
  styleUrl: './template-navbar.component.css'
})
export class TemplateNavbarComponent {
  @Input() title: string = 'Template';
  @Input() submitText: string = 'Submit';

  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    this.submit.emit();
  }
}
