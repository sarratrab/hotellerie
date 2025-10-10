import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResponseService, SaveResponseDto } from '../../../services/response.service';
import { FormRow } from '../../../models/form.model';
import { FormFieldPreviewComponent } from '../../Survey-Builder-tool/main-canvas/form-field-preview/form-field-preview.component';
import { catchError, map, of, switchMap, tap } from 'rxjs';
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
  imports: [SurveyNavbarComponent, CommonModule,
    RouterModule,
    FormsModule, NavbarComponent, FormFieldPreviewComponent],
  templateUrl: './viewanswer.component.html',
  styleUrl: './viewanswer.component.css'
})
export class SurveyViewAnswerComponent implements OnInit {
  surveyId!: string;
  templateId!: string;
  employeeId = 4;

  rows: FormRow[] = [];
  loading = true;
  errorMsg: string | null = null;
  survey: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tplSvc: TemplateService,
    private respSvc: ResponseService,
    private srv: SurveyService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.errorMsg = null;

    // Hardcoded template definition
    const fakeTemplateDefinition = JSON.stringify({
      rows: [
        {
          id: 'row1',
          fields: [
            {
              id: 'fe066c0e-789d-4965-82f1-8e8a79d2a0f2',
              label: 'Please enter your name',
              type: 'text',
              placeholder: 'Enter name...',
              required: true,
            },
            {
              id: '4dba9f7b-82dc-4506-8f79-8ff1876584ab',
              label: 'Choose one option',
              type: 'radio',
              options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' }
              ],
              required: true
            }
          ]
        }
      ]
    });

    const hardcodedAnswers: SurveyResponseItem[] = [
      {
        FieldId: 'fe066c0e-789d-4965-82f1-8e8a79d2a0f2',
        Type: 'text',
        Value: 'Hello User'
      },
      {
        FieldId: '4dba9f7b-82dc-4506-8f79-8ff1876584ab',
        Type: 'radio',
        Value: 'option2'
      }
    ];

    // Parse template rows and inject answers
    const parsed = this.extractRows(fakeTemplateDefinition);
    this.rows = parsed.map(row => ({
      ...row,
      fields: row.fields.map(f => ({
        ...f,
        answer: hardcodedAnswers.find(a => a.FieldId === f.id)?.Value ?? null
      }))
    }));

    this.surveyId = '1';
    this.employeeId = 4;
    this.loading = false;
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

  // Get display value for the answer
  getDisplayValue(field: FormField): string {
    if (!field.answer) return 'No answer provided';

    switch (field.type) {
      case 'checkbox':
        const checkboxValues = Array.isArray(field.answer) ? field.answer : [];
        return checkboxValues.length > 0 ? checkboxValues.join(', ') : 'None selected';

      case 'radio':
      case 'select':
        const option = field.options?.find(opt => opt.value === field.answer);
        return option ? option.label : field.answer;

      case 'date':
        return field.answer instanceof Date 
          ? field.answer.toLocaleDateString() 
          : field.answer;

      default:
        return field.answer.toString();
    }
  }

  goBack(): void {
    this.router.navigate(['/surveys']);
  }

}