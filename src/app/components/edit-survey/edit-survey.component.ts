import { Component } from '@angular/core';
import { SurveyNavbarComponent } from "../survey-navbar/survey-navbar.component";
import { TemplateNavbarComponent } from "../template-header/template-navbar.component";
import { TargetAudiencePanelComponent } from "../lanch-survey/target-audience-panel/target-audience-panel.component";
import { EmployeeSelectorComponent } from "../lanch-survey/employee-selector/employee-selector.component";
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-edit-survey',
  imports: [SurveyNavbarComponent, TemplateNavbarComponent, TargetAudiencePanelComponent, EmployeeSelectorComponent],
  templateUrl: './edit-survey.component.html',
  styleUrl: './edit-survey.component.css'
})
export class EditSurveyComponent {
  constructor(
      private location: Location,
      private router: Router,
    ) {}
onSubmit() {
throw new Error('Method not implemented.');
}
onCancel() {
if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigate(['/surveys']);
}

}
