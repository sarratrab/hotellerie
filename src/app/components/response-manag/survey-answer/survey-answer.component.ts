import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TemplateNavbarComponent } from '../../template-navbar/template-navbar.component';
import { FormFieldPreviewComponent } from '../../main-canvas/form-field-preview/form-field-preview.component';
import { SurveyNavbarComponent } from '../../survey-navbar/survey-navbar.component';
import { TemplateService } from '../../../services/template-services.service';
import { TemplateDetail } from '../../../models/interfaces/template-read';
import { FormRow } from '../../../models/form.model';
import { FormsModule } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import { HomeComponent } from "../../home/home.component";
import { NavbarComponent } from "../../navbar/navbar.component";
import { SurveyService } from '../../../services/SurveyService';




@Component({
  selector: 'app-survey-answer',
  imports: [SurveyNavbarComponent,
    TemplateNavbarComponent,
    CommonModule,
    RouterModule,
    FormFieldPreviewComponent,
    FormsModule, HomeComponent, NavbarComponent],
  templateUrl: './survey-answer.component.html',
  styleUrl: './survey-answer.component.css'
})
export class SurveyAnswerComponent implements OnInit {
 rows: FormRow[] = [];
  tpl?: TemplateDetail;
  answers: string = '';
  loading = true;
  errorMsg: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private svc: TemplateService,
    private location: Location,
    private router: Router,
    private surveySvc : SurveyService
  ) {}

   ngOnInit() {
   this.route.paramMap
  .pipe(
    switchMap(params => {
      const surveyId = params.get('surveyId');
      if (!surveyId) return of(null);
      this.loading = true;
      this.errorMsg = null;
      return this.surveySvc.getById(surveyId);
    }),
    switchMap(survey => {
      if (!survey) return of(null as unknown as TemplateDetail);
      return this.svc.getById(survey.templateId); // fetch template by templateId
    })
  )
  .subscribe({
    next: t => {
      if (!t) {
        this.errorMsg = 'Survey introuvable.';
        this.loading = false;
        return;
      }
      this.tpl = t;
      this.rows = this.extractRows(t.templateDefinition);
      this.loading = false;
    },
    error: err => {
      console.error('Loading error:', err);
      this.errorMsg = 'Erreur lors du chargement du survey.';
      this.loading = false;
    },
  });

  }

  private extractRows(jsonStr: string): FormRow[] {
    try {
      const j = JSON.parse(jsonStr);
      if (Array.isArray(j)) return j as FormRow[];
      if (j && Array.isArray(j.rows)) return j.rows as FormRow[];
      return [];
    } catch {
      return [];
    }
  }

  cancel() {
    //if (window.history.length > 1) {
      //this.location.back();
      //return;
   // }
    this.router.navigate(['/surveys']);
  }

  save() {
    console.log('Saving draft answers:', this.answers);
    // TODO: call API for draft save
  }

submit() {
  const surveyId = this.route.snapshot.paramMap.get('surveyId');
  const employeeId = "11";

  if (!surveyId) {
    console.error('No surveyId found in route');
    return;
  }

  const responseData = JSON.stringify(this.rows); // includes answers now

  this.surveySvc.addSurveyAnswer(surveyId, employeeId, responseData, true)
    .subscribe({
      next: (res) => {
        console.log('Survey submitted successfully:', res);
        alert('Survey submitted!');
        this.router.navigate(['/surveys']);
      },
      error: (err) => {
        console.error('Error submitting survey:', err);
        alert('Error submitting survey');
      }
    });
}


onFieldChange(rowId: string, fieldId: string, value: any) {
  const row = this.rows.find(r => r.id === rowId);
  if (!row) return;

  const field = row.fields.find(f => f.id === fieldId);
  if (!field) return;

  field.answer = value; // ✅ update the field with the answer
  console.log('Captured answer:', rowId, fieldId, value);
}

}
