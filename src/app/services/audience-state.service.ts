// services/audience-state.service.ts
import { Injectable } from '@angular/core';
import { AudienceSelection } from '../models/interfaces/AudienceSelection';
import { AddSurveyDto } from '../models/interfaces/AddSurveyDto';

export interface SurveyWizardState extends AudienceSelection {
  selectedEmployeeIds: number[];
  deadline?: string;         // ISO
  isAnonymous: boolean;
  templateId?: string;
  name?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class AudienceStateService {
  private state: SurveyWizardState = {
    allEmployees: false,
    departmentIds: [],
    positionIds: [],
    cities: [],
    selectedEmployeeIds: [],
    isAnonymous: false
  };

  // --- exposer proprement pour step3 ---
  get deadline(): string | undefined { return this.state.deadline; }
  get allowAnonymous(): boolean { return this.state.isAnonymous; }

  // Step 1
  setSelection(sel: AudienceSelection) { this.state = { ...this.state, ...sel }; }
  getSelection(): AudienceSelection {
    const { allEmployees, departmentIds, positionIds, cities } = this.state;
    return { allEmployees, departmentIds, positionIds, cities };
  }

  // Step 2
  setSelectedEmployees(ids: number[]) { this.state.selectedEmployeeIds = ids ?? []; }
  getSelectedEmployeeIds(): number[] { return this.state.selectedEmployeeIds ?? []; }

  // Step 3
  setSettings(deadline: Date | string | null, isAnon: boolean) {
    this.state.isAnonymous = isAnon;
    this.state.deadline = deadline ? new Date(deadline).toISOString() : undefined;
  }

  // depuis “Assign”
  setTemplateInfo(templateId: string, name?: string, description?: string) {
    this.state.templateId = templateId;
    if (name !== undefined) this.state.name = name;
    if (description !== undefined) this.state.description = description;
  }

  buildAddSurveyDto(input?: { name?: string; description?: string; templateId?: string }): AddSurveyDto {
    const name        = input?.name        ?? this.state.name        ?? 'Employee Satisfaction Survey';
    const description = input?.description ?? this.state.description ?? '';
    const templateId  = input?.templateId  ?? this.state.templateId  ?? '';

    if (!templateId) throw new Error('TemplateId is missing');
    if (!this.state.deadline) throw new Error('Deadline is missing');
    if (!this.state.selectedEmployeeIds || this.state.selectedEmployeeIds.length === 0) {
      throw new Error('No employees selected');
    }

    return {
      name,
      description,
      templateId, // <= bien “templateId”
      deadline: this.state.deadline, // ISO
      isAnonymous: this.state.isAnonymous,
      surveyStatus: 0,
      employeeIds: [...this.state.selectedEmployeeIds]
    };
  }
}
