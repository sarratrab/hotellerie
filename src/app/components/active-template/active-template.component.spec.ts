import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTemplateComponent } from './active-template.component';

describe('ActiveTemplateComponent', () => {
  let component: ActiveTemplateComponent;
  let fixture: ComponentFixture<ActiveTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
