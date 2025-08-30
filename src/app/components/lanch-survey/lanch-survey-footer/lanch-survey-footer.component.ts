import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-lanch-survey-footer',
  imports: [],
  templateUrl: './lanch-survey-footer.component.html',
  styleUrl: './lanch-survey-footer.component.css'
})
export class LanchSurveyFooterComponent {
@Output() cancel = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Input() submitText: string = 'Submit';

  onCancel() {
    this.cancel.emit();
  }

  onNext() {
    this.next.emit();
  }
}
