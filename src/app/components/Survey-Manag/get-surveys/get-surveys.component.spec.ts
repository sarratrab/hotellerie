import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSurveysComponent } from './get-surveys.component';

describe('GetSurveysComponent', () => {
  let component: GetSurveysComponent;
  let fixture: ComponentFixture<GetSurveysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetSurveysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetSurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
