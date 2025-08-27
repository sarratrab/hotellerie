import { Component } from '@angular/core';
import { TemplateNavbarComponent } from "../template-navbar/template-navbar.component";
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormFieldPreviewComponent } from '../main-canvas/form-field-preview/form-field-preview.component';
import { TemplateService } from '../../services/template-services.service';
import { SurveyNavbarComponent } from '../survey-navbar/survey-navbar.component';
import { TemplateDetail } from '../../models/interfaces/template-read';
import { FormRow } from '../../models/form.model';

@Component({
  selector: 'app-template-detail',
  imports: [
    SurveyNavbarComponent,
    TemplateNavbarComponent,
    CommonModule,
    RouterModule,
    FormFieldPreviewComponent,
  ],
  templateUrl: './template-detail.component.html',
  styleUrl: './template-detail.component.css'
})
export class TemplateDetailComponent {
  
  constructor(
    private route : ActivatedRoute,
    private svc :TemplateService,
    private location :Location,
    private router : Router,
  ) {}

  rows: FormRow[] = [];
  tpl?: TemplateDetail;
  pretty = '';
  parsed: any;
  loading = true;
  errorMsg: string | null = null;

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) return of(null as unknown as TemplateDetail);
          this.loading = true;
          this.errorMsg = null;
          return this.svc.getById(id);
        })
      )
      .subscribe({
        next: (t) => {
          if (!t) {
            this.errorMsg = 'Template introuvable.';
            this.loading = false;
            return;
          }
          this.tpl = t;
          this.pretty = this.safePretty(t.templateDefinition);
          this.rows = this.extractRows(t.templateDefinition);
          this.loading = false;
        },
        error: (err) => {
          console.error('GetById error:', err);
          this.errorMsg = 'Erreur lors du chargement du template.';
          this.loading = false;
        },
      });
  }

  cancel() {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigate(['/active-templates']);
  }

  private safePretty(jsonStr: string): string {
    try { 
      return JSON.stringify(JSON.parse(jsonStr), null, 2); 
    } catch { 
      return jsonStr ?? ''; 
    }
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
}
