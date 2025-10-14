import { Component, OnInit } from '@angular/core';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';

import { TemplateService } from '../../../services/template-services.service';
import { TemplateDetail } from '../../../models/interfaces/template-read';
import { FormRow } from '../../../models/form.model';
import { FormsModule } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import { HomeComponent } from "../../home/home.component";
import { NavbarComponent } from "../../navbar/navbar.component";
import { SurveyOutDto, SurveyService } from '../../../services/SurveyService';
import { SurveyNavbarComponent } from '../../Survey-Manag/survey-navbar/survey-navbar.component';
import { TemplateNavbarComponent } from '../../Template-Mang/template-navbar/template-navbar.component';
import { FormFieldPreviewComponent } from '../../Survey-Builder-tool/main-canvas/form-field-preview/form-field-preview.component';
import { FormField } from '../../../models/field.model';
import { ResponseService, SaveResponseDto } from '../../../services/response.service';




@Component({
  selector: 'app-survey-answer',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, NavbarComponent],
  templateUrl: './survey-answer.component.html',
  styleUrl: './survey-answer.component.css'
})
export class SurveyAnswerComponent {
  surveyId!: string;
  templateId!: string;
  employeeId =4;

  tpl?: TemplateDetail;
  rows: FormRow[] = [];
  loading = true;
  submitting = false;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  survey: any;
    readOnly = false;               // 👈 lecture seule si Completed
responseStatus?: string; 
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tplSvc: TemplateService,
    private respSvc: ResponseService,
    private srv: SurveyService
  ) {}

ngOnInit(): void {
    this.route.queryParamMap.subscribe(q => {
    const e = q.get('employeeId');
    if (e) this.employeeId = +e;
  });
  
  this.loading = true;

  this.route.paramMap.pipe(
    // 1) lire surveyId depuis l’URL, à CHAQUE navigation
    map(pm => pm.get('surveyId') ?? ''),
    tap(id => this.surveyId = id),

    // 2) charger le survey pour récupérer templateId
    switchMap(id => this.srv.getById(id)),         // Observable<SurveyOutDto>
    tap(s => this.survey = s),                      // mémoriser pour le submit()

    // 3) charger le template correspondant
    switchMap(s => this.tplSvc.getById(s.templateId)),

    // 4) gestion d’erreur douce
    catchError(err => {
      console.error(err);
      this.errorMsg = 'Erreur lors du chargement du template.';
      this.loading = false;
      return of(null);
    })
  )
  .subscribe(tpl => {
    if (!tpl) return;
    this.tpl = tpl;

    const parsed = this.extractRows(tpl.templateDefinition);
    this.rows = parsed.map(row => ({
      ...row,
      fields: row.fields.map(f => ({ ...f, answer: this.initAnswer(f) })),
    }));
    

    this.errorMsg = null;
    this.successMsg = null;
    this.loading = false;
    window.scrollTo({ top: 0 });
  });

  // (facultatif) tester un employé sans login ?employeeId=5
  this.route.queryParamMap.subscribe(q => {
    const e = q.get('employeeId');
    if (e) this.employeeId = +e;
  });
}

  private extractRows(jsonStr: string): FormRow[] {
    try {
      const j = JSON.parse(jsonStr);
      if (Array.isArray(j)) return j as FormRow[];                // [{ id, fields: [...] }]
      if (j && Array.isArray(j.rows)) return j.rows as FormRow[]; // { rows: [...] }
      return [];
    } catch { return []; }
  }

  private initAnswer(f: FormField) {
    switch (f.type) {
      case 'checkbox': return [] as string[];
      case 'number':   return null as number | null;
      case 'date':     return null;
      default:         return '';
    }
  }

// Helpers lisibles pour le template
isArray(v: any): v is any[] {
  return Array.isArray(v);
}

hasOption(f: FormField, val: string): boolean {
  const arr: string[] = Array.isArray(f.answer) ? f.answer : [];
  return arr.includes(val);
}

// Tu as déjà celle-ci, je la remets pour contexte :
onToggleCheckbox(f: FormField, value: string, checked: boolean) {
  const cur: string[] = Array.isArray(f.answer) ? f.answer : [];
  f.answer = checked ? [...cur, value] : cur.filter(v => v !== value);
}




  private serializeValue(f: FormField): string {
    if (f.type === 'checkbox') return JSON.stringify(Array.isArray(f.answer) ? f.answer : []);
    if (typeof f.answer === 'object' && f.answer !== null) return JSON.stringify(f.answer);
    return (f.answer ?? '').toString();
  }

  isInvalid(f: FormField): boolean {
    if (!f.required) return false;
    if (f.type === 'checkbox') return !f.answer || (f.answer as any[]).length === 0;
    return f.answer === '' || f.answer === null || f.answer === undefined;
  }

  canSubmit(): boolean {
    return this.rows.every((r: FormRow) => r.fields.every((c: FormField) => !this.isInvalid(c)));
  }

  saveDraft() { this.submit(false); }

  submit(finalize = true) {
    if (!this.tpl) return;

    if (finalize && !this.canSubmit()) { this.errorMsg = 'Veuillez compléter les champs obligatoires.'; return; }

    const answers = this.rows.flatMap((r: FormRow) =>
      r.fields.map((f: FormField) => ({
        fieldId: f.id,
        type: f.type,
        value: this.serializeValue(f)
      }))
    );

    const payload: SaveResponseDto = {
      templateId: this.survey.templateId,
      surveyId: this.surveyId,
      employeeId: this.employeeId,
      answers,
      finalize
    };

    this.submitting = true;
    this.respSvc.saveResponse(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.successMsg = finalize ? 'Réponse soumise avec succès.' : 'Brouillon enregistré.';
      },
      error: () => {
        this.submitting = false;
        this.errorMsg = 'Échec de l’enregistrement.';
      }
    });
  }
}