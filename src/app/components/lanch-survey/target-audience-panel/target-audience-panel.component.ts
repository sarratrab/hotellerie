// target-audience-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

import { SurveyServiceService } from '../../../services/survey-service.service';
import { DepartmentListItem } from '../../../models/interfaces/DepartementListItem';
import { PositionListItem } from '../../../models/interfaces/PositionListItem';
import { LocationListItem } from '../../../models/interfaces/LocationListItem';
import { AudienceStateService } from '../../../services/audience-state.service';

@Component({
  selector: 'app-target-audience-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MultiSelectModule, CalendarModule, CheckboxModule, ButtonModule],
  templateUrl: './target-audience-panel.component.html',
  styleUrls: ['./target-audience-panel.component.css']
})
export class TargetAudiencePanelComponent implements OnInit {

  // Checkboxes
  allEmployees = false;
  byLocation = false;
  byDepartment = false;
  byPosition = false;

  // Selected values (PrimeNG MultiSelect stocke les objets d’option quand on ne met pas optionValue)
selectedLocations: string[] = [];
selectedDepartments: number[] = [];
selectedPositions: number[] = [];



onToggleAll(checked: boolean) {
  this.allEmployees = checked;
  if (checked) {
    this.byDepartment = this.byLocation = this.byPosition = false;
    this.selectedDepartments = [];
    this.selectedLocations = [];
    this.selectedPositions = [];
  }
  this.persistSelection();
}

onToggleSegment(kind: 'dept' | 'loc' | 'pos', checked: boolean) {
  if (kind === 'dept') { this.byDepartment = checked; if (!checked) this.selectedDepartments = []; }
  if (kind === 'loc')  { this.byLocation  = checked; if (!checked) this.selectedLocations  = []; }
  if (kind === 'pos')  { this.byPosition  = checked; if (!checked) this.selectedPositions  = []; }
  if (checked) this.allEmployees = false;
  this.persistSelection();
}

// Sauvegarde centrale vers le service partagé
persistSelection() {
  this.audienceState.setSelection({
    allEmployees: this.allEmployees,
    departmentIds: this.byDepartment ? this.selectedDepartments : [],
    positionIds:   this.byPosition   ? this.selectedPositions   : [],
    cities:        this.byLocation   ? this.selectedLocations   : []
  });
}

onNext() {
  // plus de mapping nécessaire : tu as déjà des primitives
  this.persistSelection();
  console.log('Step1 selection saved:', this.audienceState.getSelection());
}

  // Options (remplies par l’API)
  locationOptions:  { name: string; value: string }[] = [];
  departmentOptions:{ name: string; value: number }[] = [];
  positionOptions:  { name: string; value: number }[] = [];

  loading = false;
  error?: string;

  constructor(private lookups: SurveyServiceService,private audienceState: AudienceStateService) {}

  ngOnInit(): void {
    this.loadLookups();
  }

  private loadLookups() {
    this.loading = true;
    this.error = undefined;

    Promise.all([
      this.lookups.getDepartments(true).toPromise(),
      this.lookups.getLocations(true).toPromise(),
      this.lookups.getPositions(true).toPromise()
    ]).then(([depts, locs, pos]) => {
      // map → {name, value} pour MultiSelect
      this.departmentOptions = (depts ?? []).map((d: DepartmentListItem) => ({
        name: d.name, value: d.departmentId
      }));
      this.locationOptions = (locs ?? []).map((l: LocationListItem) => ({
        name: `${l.city} (${l.employeesCount})`, value: l.city
      }));
      this.positionOptions = (pos ?? []).map((p: PositionListItem) => ({
        name: p.name, value: p.positionId
      }));
      this.loading = false;
    }).catch(err => {
      console.error(err);
      this.error = 'Failed to load options. Please try again.';
      this.loading = false;
    });
  }

  // ----- computed helpers -----
  get segmentingDisabled(): boolean {
    return this.allEmployees;
  }
  get allDisabled(): boolean {
    return this.byDepartment || this.byLocation || this.byPosition;
  }

  // Résumé
  getSelectionSummary(): string {
    if (this.allEmployees) {
      return 'This survey will be sent to all employees in your organization.';
    }
    const parts: string[] = [];
    if (this.byLocation && this.selectedLocations?.length) {
      parts.push(`${this.selectedLocations.length} location(s)`);
    }
    if (this.byDepartment && this.selectedDepartments?.length) {
      parts.push(`${this.selectedDepartments.length} department(s)`);
    }
    if (this.byPosition && this.selectedPositions?.length) {
      parts.push(`${this.selectedPositions.length} position(s)`);
    }
    return parts.length ? `This survey will be sent to employees in: ${parts.join(', ')}.` : '';
  }

  onCancel() {
    console.log('Survey creation cancelled');
  }


}
