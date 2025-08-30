import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanchSurveyFooterComponent } from './lanch-survey-footer.component';

describe('LanchSurveyFooterComponent', () => {
  let component: LanchSurveyFooterComponent;
  let fixture: ComponentFixture<LanchSurveyFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanchSurveyFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanchSurveyFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
