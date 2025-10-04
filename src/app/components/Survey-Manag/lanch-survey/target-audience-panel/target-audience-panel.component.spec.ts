import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetAudiencePanelComponent } from './target-audience-panel.component';

describe('TargetAudiencePanelComponent', () => {
  let component: TargetAudiencePanelComponent;
  let fixture: ComponentFixture<TargetAudiencePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetAudiencePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetAudiencePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
