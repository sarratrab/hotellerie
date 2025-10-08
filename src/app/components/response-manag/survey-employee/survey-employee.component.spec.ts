import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyEmployeeComponent } from './survey-employee.component';

describe('SurveyEmployeeComponent', () => {
  let component: SurveyEmployeeComponent;
  let fixture: ComponentFixture<SurveyEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
