import { Component } from '@angular/core';
import { TargetAudiencePanelComponent } from "../target-audience-panel/target-audience-panel.component";
import { EmployeeSelectorComponent } from "../employee-selector/employee-selector.component";
import { SurveyNavbarComponent } from "../../survey-navbar/survey-navbar.component";
import { Button } from "primeng/button";
import { TemplateNavbarComponent } from "../../template-header/template-navbar.component";

@Component({
  selector: 'app-lanch-survey',
  imports: [TargetAudiencePanelComponent, EmployeeSelectorComponent, SurveyNavbarComponent, TemplateNavbarComponent],
  templateUrl: './lanch-survey.component.html',
  styleUrl: './lanch-survey.component.css'
})
export class LanchSurveyComponent {
onCancel() {
throw new Error('Method not implemented.');
}
onSubmit() {
throw new Error('Method not implemented.');
}

}
