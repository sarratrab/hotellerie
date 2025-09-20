import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AudienceStateService } from '../../../services/audience-state.service';
import { SurveyService } from '../../../services/SurveyService'; // vérifie le nom exact du fichier

@Component({
  selector: 'app-launch-step3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './launch-step3.component.html',
  styleUrls: ['./launch-step3.component.css']
})
export class LaunchStep3Component implements OnInit {
  isAnonymous = false;
  // champ “date” du HTML → ‘YYYY-MM-DD’
  deadline: string = new Date().toISOString().substring(0, 10);

  loading = false;
  error?: string;
  success?: string;
  surveyId: string | undefined;

  constructor(
    private wizard: AudienceStateService,
    private surveyApi: SurveyService,
    private router: Router,
    private route: ActivatedRoute,
    private audienceState: AudienceStateService
  ) {}

ngOnInit(): void {
  // --- read surveyId from parent route ---
  this.route.parent?.paramMap.subscribe(params => {
   const rawId = this.route.parent?.snapshot.paramMap.get('id');
    this.surveyId = rawId && rawId !== 'undefined' && rawId !== 'null' && rawId !== '' 
      ? rawId 
      : undefined;
    console.log('surveyId:', this.surveyId);

  });

const templateId = this.wizard.getTemplateId();
const templateName = this.wizard.getTemplateName();

  // --- restore wizard state ---
  if (this.wizard.deadline) {
    this.deadline = this.wizard.deadline.substring(0, 10);
  }
  this.isAnonymous = this.wizard.allowAnonymous ?? false;
}


  public onCancel() {
    console.log('[Step3] onCancel called');
    this.wizard.setSettings(this.deadline, this.isAnonymous);
    this.router.navigate(['/lanch-survey/step2']);
  }

  onNext() {
  this.error = this.success = undefined;
  this.loading = true;


  try {
    // 1) stocker et convertir en ISO dans le service
    this.wizard.setSettings(this.deadline, this.isAnonymous);

    // 2) Construire le DTO (NOM/desc/TemplateId déjà placés via Assign)
    const dto = this.wizard.buildAddSurveyDto();
    console.log('[Step3] DTO =', dto);

    if (this.surveyId) {
      // --- EDIT MODE ---
      this.surveyApi.updateSurvey(this.surveyId, dto).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Survey updated successfully';
          this.router.navigate(['/surveys']);
        },
        error: (err: { error: { message: any; }; statusText: any; }) => {
          this.loading = false;
          const detail = err?.error?.message || err?.error || err?.statusText || 'Bad Request';
          this.error = `Failed to update survey: ${detail}`;
          console.error('Update survey error:', err);
        }
      });

    } else {
      // --- ADD MODE ---
      this.surveyApi.addSurvey(dto).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Survey created successfully';
          this.router.navigate(['/surveys']);
        },
        error: (err) => {
          this.loading = false;
          const detail = err?.error?.message || err?.error || err?.statusText || 'Bad Request';
          this.error = `Failed to create survey: ${detail}`;
          console.error('Create survey error:', err);
        }
      });
    }

  } catch (e: any) {
    this.loading = false;
    this.error = e?.message || 'Invalid data';
    console.warn('Client-side validation failed:', e);
  }
}

}
