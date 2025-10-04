import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyInfo } from './step1-survey-info.component';

describe('LaunchStep3Component', () => {
  let component: SurveyInfo;
  let fixture: ComponentFixture<SurveyInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
