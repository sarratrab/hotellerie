import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { SurveyNavbarComponent } from "../../survey-navbar/survey-navbar.component";
import { LanchSurveyStepsNavComponent } from "../lanch-survey-steps-nav/lanch-survey-steps-nav.component";
import { LanchSurveyFooterComponent } from "../lanch-survey-footer/lanch-survey-footer.component";

@Component({
  selector: 'app-lanch-survey',
  standalone: true,
  imports: [SurveyNavbarComponent, LanchSurveyStepsNavComponent, LanchSurveyFooterComponent, RouterOutlet],
  templateUrl: './lanch-survey.component.html',
  styleUrls: ['./lanch-survey.component.css']
})
export class LanchSurveyComponent {
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
    console.log('Survey saved!');
    this.router.navigate(['/surveys']);
  }
}
