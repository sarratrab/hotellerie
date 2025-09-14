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

  constructor(
    private wizard: AudienceStateService,
    private surveyApi: SurveyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1) Si tu arrives ici depuis "Assign", récupère le templateId (et éventuellement le name) en query params
    this.route.queryParams.subscribe((p) => {
      const templateId = p['templateId'] || p['id'];
      const templateName = p['name'];
      if (templateId) this.wizard.setTemplateInfo(templateId, templateName);
    });

    // 2) Pré-remplir depuis l’état si tu reviens en arrière
    if (this.wizard.deadline) {
      this.deadline = this.wizard.deadline.substring(0, 10);
    }
    this.isAnonymous = this.wizard.allowAnonymous ?? false;
  }

  public onCancel() {
    console.log('[Step3] onCancel called');
    this.router.navigate(['/lanch-survey/step2']);
  }

  onNext() {
    this.error = this.success = undefined;
    this.loading = true;

    try {
      // 1) stocker et convertir en ISO dans le service
      // (deadline ici est 'YYYY-MM-DD', le service fera toISOString)
      this.wizard.setSettings(this.deadline, this.isAnonymous);

      // 2) Construire le DTO (NOM/desc/TemplateId déjà placés via Assign)
      const dto = this.wizard.buildAddSurveyDto();
      console.log('[Step3] POST dto =', dto);

      // 3) API
      this.surveyApi.addSurvey(dto).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Survey created successfully';
          this.router.navigate(['/surveys']);
        },
        error: (err) => {
          this.loading = false;
          // essayer d’extraire l’erreur côté .NET (ModelState) si dispo
          const detail = err?.error?.message || err?.error || err?.statusText || 'Bad Request';
          this.error = `Failed to create survey: ${detail}`;
          console.error('Create survey error:', err);
        }
      });
    } catch (e: any) {
      this.loading = false;
      this.error = e?.message || 'Invalid data';
      console.warn('Client-side validation failed:', e);
    }
  }
}
