import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { SurveyNavbarComponent } from "../../survey-navbar/survey-navbar.component";
import { LanchSurveyStepsNavComponent } from "../lanch-survey-steps-nav/lanch-survey-steps-nav.component";
import { LanchSurveyFooterComponent } from "../lanch-survey-footer/lanch-survey-footer.component";
import { LaunchStep3Component } from '../launch-step3/launch-step3.component';

@Component({
  selector: 'app-lanch-survey',
  standalone: true,
  imports: [SurveyNavbarComponent, LanchSurveyStepsNavComponent, LanchSurveyFooterComponent, RouterOutlet],
  templateUrl: './lanch-survey.component.html',
  styleUrls: ['./lanch-survey.component.css']
})
export class LanchSurveyComponent implements AfterViewInit {
  @ViewChild(RouterOutlet) outlet?: RouterOutlet;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    // petit log pour vérifier que l’outlet est bien résolu
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
      child.onNext();               // délégation au Step courant
      return;
    }
    // fallback de sécurité si jamais
    if (this.router.url.includes('step1')) this.router.navigate(['/lanch-survey/step2']);
    else if (this.router.url.includes('step2')) this.router.navigate(['/lanch-survey/step3']);
  }

  cancel() {
    const child = this.activeChild();
    if (child?.onCancel) {
      child.onCancel();
      return;
    }
    // fallback
    if (this.router.url.includes('step3')) this.router.navigate(['/lanch-survey/step2']);
    else if (this.router.url.includes('step2')) this.router.navigate(['/lanch-survey/step1']);
    else this.router.navigate(['/active-templates']);
  }
}