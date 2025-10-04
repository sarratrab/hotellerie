import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast'; // ✅ for <p-toast>
import { MessageService } from 'primeng/api'; // ✅ to use MessageService

import { InputTextModule } from 'primeng/inputtext';
import { AudienceStateService } from '../../../../services/audience-state.service';
import { SurveyService } from '../../../../services/SurveyService';
import { Toast } from "primeng/toast";


@Component({
  selector: 'app-launch-step3',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
   providers: [MessageService], // ✅ provide MessageService
  templateUrl: './step1-survey-info.component.html',
  styleUrls: ['./step1-survey-info.component.css']
})
export class SurveyInfo implements OnInit {
  isAnonymous = false;
   value: string | undefined;
  // champ “date” du HTML → ‘YYYY-MM-DD’
  deadline: string = new Date().toISOString().substring(0, 10);

  loading = false;
  error?: string;
  success?: string;
  surveyId: string | undefined;
form: any;
surveyName: string = '';

  constructor(
    private wizard: AudienceStateService,
    private surveyApi: SurveyService,
    private router: Router,
    private route: ActivatedRoute,
    private audienceState: AudienceStateService,
    private messageService: MessageService
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

  // Restore saved values from wizard service
  this.deadline = this.wizard.deadline?.substring(0, 10) ?? new Date().toISOString().substring(0, 10);
  this.isAnonymous = this.wizard.allowAnonymous ?? false;
  this.surveyName = this.wizard.getTemplateName() ?? this.wizard['state']?.name ?? '';

}
onNext(): boolean {  // Return boolean
  console.log('onNext called');
  
  try {
    const template = this.wizard.getTemplateId();
    if (!template) {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Validation Error',
        detail: 'No template selected',
        life: 3000
      });
      return false; // ❌ Stop navigation
    }
    
    if (!this.surveyName || this.surveyName.trim() === '') {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Survey name is required',
        life: 3000
      });
      return false; // ❌ Stop navigation
    }
    
    // Save current step state
    this.wizard.setSettings(this.deadline, this.isAnonymous, this.surveyName);
    return true; // ✅ Allow navigation
    
  } catch (e: any) {
    this.messageService.add({
      key: 'tc',
      severity: 'error',
      summary: 'Error',
      detail: e?.message || 'Invalid data',
      life: 3000
    });
    console.warn('Client-side validation failed:', e);
    return false; // ❌ Stop navigation
  }
}

testToast() {
  console.log('Testing toast...');
  this.messageService.add({
    key: 'tc',
    severity: 'success',
    summary: 'Test',
    detail: 'Toast is working!',
    life: 3000
  });
}
  public onCancel() {
    console.log('[Step3] onCancel called');
    this.wizard.setSettings(this.deadline, this.isAnonymous, this.surveyName);
    this.router.navigate(['/active-templates']);
  }

}
