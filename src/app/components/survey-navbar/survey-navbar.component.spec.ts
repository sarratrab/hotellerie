import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyNavbarComponent } from './survey-navbar.component';

describe('SurveyNavbarComponent', () => {
  let component: SurveyNavbarComponent;
  let fixture: ComponentFixture<SurveyNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
