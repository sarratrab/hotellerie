import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-lanch-survey-footer',
  imports: [],
  templateUrl: './lanch-survey-footer.component.html',
  styleUrl: './lanch-survey-footer.component.css'
})
export class LanchSurveyFooterComponent {
@Input() cancelLabel = 'Cancel';
  @Input() nextLabel = 'Next';

  @Output() cancel = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Input() submitText: string = 'Submit';

  
}
