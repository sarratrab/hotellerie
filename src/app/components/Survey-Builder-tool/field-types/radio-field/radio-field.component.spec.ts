import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioFieldComponent } from './radio-field.component';

describe('RadioFieldComponent', () => {
  let component: RadioFieldComponent;
  let fixture: ComponentFixture<RadioFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
