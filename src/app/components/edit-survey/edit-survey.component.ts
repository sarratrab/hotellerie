import { Component } from '@angular/core';
import { SurveyNavbarComponent } from "../survey-navbar/survey-navbar.component";
import { TemplateNavbarComponent } from "../template-header/template-navbar.component";
import { TargetAudiencePanelComponent } from "../lanch-survey/target-audience-panel/target-audience-panel.component";
import { EmployeeSelectorComponent } from "../lanch-survey/employee-selector/employee-selector.component";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LanchSurveyStepsNavComponent } from "../lanch-survey/lanch-survey-steps-nav/lanch-survey-steps-nav.component";
import { RouterOutlet } from '@angular/router';
import { LanchSurveyFooterComponent } from "../lanch-survey/lanch-survey-footer/lanch-survey-footer.component";

@Component({
  selector: 'app-edit-survey',
  imports: [SurveyNavbarComponent, LanchSurveyStepsNavComponent, RouterOutlet, LanchSurveyFooterComponent],
  templateUrl: './edit-survey.component.html',
  styleUrl: './edit-survey.component.css'
})
export class EditSurveyComponent {
constructor(private router: Router) {}

  next() {
    if (this.router.url.includes('step1')) {
      this.router.navigate(['/lanch-survey/step2']);   // ✅ absolute
    } else if (this.router.url.includes('step2')) {
      this.router.navigate(['/lanch-survey/step3']);   // ✅ absolute
    } else if (this.router.url.includes('step3')) {
      this.saveSurvey();
    }
  }

  cancel() {
    if (this.router.url.includes('step1')) {
      this.router.navigate(['/active-templates']);
    } else if (this.router.url.includes('step2')) {
      this.router.navigate(['/lanch-survey/step1']);   // ✅ absolute
    } else if (this.router.url.includes('step3')) {
      this.router.navigate(['/lanch-survey/step2']);   // ✅ absolute
    }
  }

  private saveSurvey() {
    console.log('Survey updated!');
    this.router.navigate(['/surveys']);
  }
}

