import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResponseService, SaveResponseDto } from '../../../services/response.service';
import { FormRow } from '../../../models/form.model';
import { FormFieldPreviewComponent } from '../../Survey-Builder-tool/main-canvas/form-field-preview/form-field-preview.component';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { TemplateService } from '../../../services/template-services.service';
import { SurveyService } from '../../../services/SurveyService';
import { TemplateDetail } from '../../../models/interfaces/template-read';
import { FormField } from '../../../models/field.model';
import { SurveyNavbarComponent } from "../../Survey-Manag/survey-navbar/survey-navbar.component";
import { MockResponseService } from '../../../models/interfaces/SurveyResponseItem';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';


type SurveyResponseItem = {
  FieldId: string;
  Type: string;   // e.g., 'text', 'radio', 'select', ...
  Value: any;
};

@Component({
  selector: 'app-viewanswer',
  imports: [ CommonModule,
    RouterModule,
    FormsModule, NavbarComponent, FormFieldPreviewComponent],
  templateUrl: './viewanswer.component.html',
  styleUrl: './viewanswer.component.css'
})
export class SurveyViewAnswerComponent implements OnInit {
    surveyId!: string;
  templateId!: string;
  employeeId = 9;

  rows: FormRow[] = [];
  loading = true;
  errorMsg: string | null = null;
  survey: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tplSvc: TemplateService,
    private respSvc: ResponseService,
    private surveySvc: SurveyService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.errorMsg = null;

    // Extract surveyId from URL
    this.surveyId = this.route.snapshot.paramMap.get('id') || '';
    console.log('SurveyId from route:', this.surveyId);

    if (!this.surveyId) {
      this.errorMsg = 'Survey ID is missing from URL';
      this.loading = false;
      return;
    }

    // Step 1: Get Survey by ID to get templateId
    this.surveySvc.getById(this.surveyId).pipe(
      catchError(err => {
        console.error('Error fetching survey:', err);
        this.errorMsg = 'Failed to load survey. Please try again.';
        this.loading = false;
        return of(null);
      })
    ).subscribe(survey => {
      console.log('Survey loaded:', survey);
      
      if (!survey) {
        this.errorMsg = 'Survey not found';
        this.loading = false;
        return;
      }

      this.survey = survey;
      this.templateId = survey.templateId;
      console.log('Template ID:', this.templateId);

      // Step 2: Fetch both template and response data in parallel
      forkJoin({
        template: this.tplSvc.getById(this.templateId).pipe(
          catchError(err => {
            console.error('Error fetching template:', err);
            return of(null);
          })
        ),
        response: this.respSvc.getResponseBySurveyAndEmployee(this.surveyId, this.employeeId).pipe(
          catchError(err => {
            console.error('Error fetching response:', err);
            console.error('Error status:', err.status);
            console.error('Error message:', err.message);
            return of(null);
          })
        )
      }).subscribe(({ template, response }) => {
        console.log('Template received:', template);
        console.log('Response received:', response);

        if (!template) {
          this.errorMsg = 'Failed to load survey template.';
          this.loading = false;
          return;
        }

        if (!response) {
          this.errorMsg = `No response found for Survey ID: ${this.surveyId} and Employee ID: ${this.employeeId}`;
          this.loading = false;
          return;
        }

        // Parse template definition
        const templateDefinition = template.templateDefinition;
        console.log('Template definition:', templateDefinition);
        
        const parsedRows = this.extractRows(templateDefinition);
        console.log('Parsed rows:', parsedRows);

        // Parse response data (JSON string containing answers)
        let answers: SurveyResponseItem[] = [];
        try {
          console.log('Response data to parse:', response.responseData);
          answers = JSON.parse(response.responseData);
          console.log('Parsed answers:', answers);
        } catch (err) {
          console.error('Error parsing response data:', err);
          this.errorMsg = 'Invalid response data format.';
          this.loading = false;
          return;
        }

        // Merge template with answers
        this.rows = parsedRows.map(row => ({
          ...row,
          fields: row.fields.map(f => {
            const answer = answers.find(a => a.FieldId === f.id)?.Value ?? null;
            console.log(`Field ${f.id} answer:`, answer);
            return {
              ...f,
              answer: answer
            };
          })
        }));

        console.log('Final rows with answers:', this.rows);
        this.loading = false;
      });
    });
  }

  private extractRows(jsonStr: string): FormRow[] {
    try {
      const j = JSON.parse(jsonStr);
      if (Array.isArray(j)) return j as FormRow[];
      if (j && Array.isArray(j.rows)) return j.rows as FormRow[];
      return [];
    } catch (err) {
      console.error('Error extracting rows:', err);
      return [];
    }
  }

  goBack(): void {
    this.router.navigate(['/surveys']);
  }
}

