import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
export class LanchSurveyComponent implements AfterViewInit {
  private readonly routes = {
  step1: '/lanch-survey/step1',
  step2: '/lanch-survey/step2', 
  step3: '/lanch-survey/step3',
  templates: '/active-templates'
};
  @ViewChild(RouterOutlet) outlet?: RouterOutlet;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('[Parent] outlet.component =', this.outlet?.component);
    }, 0);
  }

  private activeChild(): any {
    return this.outlet?.component as any;
  }

  next() {
    const child = this.activeChild();
    if (child?.onNext) {
      child.onNext();              
      return;
    }
     const currentUrl = this.router.url;
    if (currentUrl.includes('step1')) this.router.navigate([this.routes.step2]);
    else if (currentUrl.includes('step2')) this.router.navigate([this.routes.step3]);
  }

  cancel() {
    const child = this.activeChild();
    if (child?.onCancel) {
      child.onCancel();
      return;
    }
    const currentUrl = this.router.url;
    if (currentUrl.includes('step3')) this.router.navigate([this.routes.step2]);
    else if (currentUrl.includes('step2')) this.router.navigate([this.routes.step1]);
    else this.router.navigate([this.routes.templates]);
  }
}