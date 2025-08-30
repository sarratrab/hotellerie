import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchStep3Component } from './launch-step3.component';

describe('LaunchStep3Component', () => {
  let component: LaunchStep3Component;
  let fixture: ComponentFixture<LaunchStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchStep3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
