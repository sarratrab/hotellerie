import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanchSurveyComponent } from './lanch-survey.component';

describe('LanchSurveyComponent', () => {
  let component: LanchSurveyComponent;
  let fixture: ComponentFixture<LanchSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanchSurveyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanchSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
