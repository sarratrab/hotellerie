import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanchSurveyStepsNavComponent } from './lanch-survey-steps-nav.component';

describe('LanchSurveyStepsNavComponent', () => {
  let component: LanchSurveyStepsNavComponent;
  let fixture: ComponentFixture<LanchSurveyStepsNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanchSurveyStepsNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanchSurveyStepsNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
