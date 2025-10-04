import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldPreviewComponent } from './form-field-preview.component';

describe('FormFieldPreviewComponent', () => {
  let component: FormFieldPreviewComponent;
  let fixture: ComponentFixture<FormFieldPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
