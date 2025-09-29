import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SurveyNavbarComponent } from "../../survey-navbar/survey-navbar.component";
import { LanchSurveyStepsNavComponent } from "../lanch-survey-steps-nav/lanch-survey-steps-nav.component";
import { LanchSurveyFooterComponent } from "../lanch-survey-footer/lanch-survey-footer.component";
import { filter } from 'rxjs';

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

  cancelLabel = 'Cancel';
  nextLabel = 'Next';
  showExtraCancel = false;

  constructor(private router: Router, private route: ActivatedRoute , private cdr: ChangeDetectorRef) {
   
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('[Parent] outlet.component =', this.outlet?.component);
    }, 0);
  }

  private activeChild(): any {
    return this.outlet?.component as any;
  }
/*
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
  }*/


  private stepRoutes = ['step1', 'step2', 'step3'];

 

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateLabels();
      });
  }

  private updateLabels() {
    const child = this.route.firstChild?.snapshot;
    this.cancelLabel = child?.data?.['cancelLabel'] ?? 'Cancel';
    this.nextLabel = child?.data?.['nextLabel'] ?? 'Next';
    this.showExtraCancel = child?.data?.['showExtraCancel'] ?? false;
     console.log('showExtraCancel now:', this.showExtraCancel);
  }
async next() {
  const child = this.outlet?.component as any;
  if (child?.onNext) await child.onNext();
  this.navigateNext();
}



// Handles actual route navigation
private navigateNext() {
  const stepRoutes = ['step1', 'step2', 'step3'];
  const currentIndex = stepRoutes.findIndex(r => this.router.url.includes(r));

  if (currentIndex >= 0 && currentIndex < stepRoutes.length - 1) {
    this.router.navigate([`/lanch-survey/${stepRoutes[currentIndex + 1]}`]);
  }
}

 cancel() {
  const child = this.outlet?.component as any;
  if (child?.onCancel) {
    child.onCancel();
  }
  const current = this.stepRoutes.findIndex(r => this.router.url.includes(r));
  if (current > 0) {
    this.router.navigate([`/lanch-survey/${this.stepRoutes[current - 1]}`]);
  } else {
    this.router.navigate(['/active-templates']);
  }
}
extraCancel() {
  // Always exit survey
  this.router.navigate(['/active-templates']);
}

}