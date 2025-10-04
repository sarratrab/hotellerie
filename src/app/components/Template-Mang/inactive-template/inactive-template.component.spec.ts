import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveTemplateComponent } from './inactive-template.component';

describe('InactiveTemplateComponent', () => {
  let component: InactiveTemplateComponent;
  let fixture: ComponentFixture<InactiveTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactiveTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InactiveTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
