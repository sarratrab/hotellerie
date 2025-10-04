import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldButtonComponent } from './field-button.component';

describe('FieldButtonComponent', () => {
  let component: FieldButtonComponent;
  let fixture: ComponentFixture<FieldButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
