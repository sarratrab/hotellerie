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
import { ActivatedRoute, Router } from '@angular/router';

interface SelectOption {
  name: string;
  value: number | string;
}

@Component({
  selector: 'app-target-audience-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MultiSelectModule, CalendarModule, CheckboxModule, ButtonModule],
  templateUrl: './target-audience-panel.component.html',
  styleUrls: ['./target-audience-panel.component.css']
})
export class TargetAudiencePanelComponent implements OnInit {

  allEmployees = false;
  byLocation = false;
  byDepartment = false;
  byPosition = false;

  selectedLocations: string[] = [];
  selectedDepartments: number[] = [];
  selectedPositions: number[] = [];

  locationOptions: { name: string; value: string }[] = [];
  departmentOptions: { name: string; value: number }[] = [];
  positionOptions: { name: string; value: number }[] = [];

  loading = false;
  error?: string;

  private isEditMode = false;
  private surveyId?: string;

  constructor(
    private router: Router,
    private lookups: SurveyServiceService,
    private audienceState: AudienceStateService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
     this.surveyId = this.route.parent?.snapshot.paramMap.get('id') ?? undefined;
    console.log('surveyId:', this.surveyId);
      this.isEditMode = !!this.surveyId;

      this.loadLookups();

   if (this.isEditMode && this.surveyId) {
  this.audienceState.loadSurveyConfig(this.surveyId).subscribe({
    next: config => {
      console.log('Loaded survey config', config);

      // Map loaded config to UI variables
      this.allEmployees = config.allEmployees;
      this.byDepartment = config.departmentIds?.length > 0;
      this.byLocation = config.cities?.length > 0;
      this.byPosition = config.positionIds?.length > 0;

      this.selectedDepartments = config.departmentIds || [];
      this.selectedPositions = config.positionIds || [];
      this.selectedLocations = config.cities || [];

      // Update state service as well
      this.audienceState.setSelection({
        allEmployees: this.allEmployees,
        departmentIds: this.selectedDepartments,
        positionIds: this.selectedPositions,
        cities: this.selectedLocations
      });
    },
    error: err => console.error(err)
  });
}
 else {
        this.restorePreviousSelection();
        this.audienceState.resetAudience();
      }
    });
  }

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

  onNext() {
    const deptIds = (this.selectedDepartments || []).map((d: any) => d.id ?? d.value);
    const posIds  = (this.selectedPositions  || []).map((p: any) => p.id ?? p.value);
    const cities  = (this.selectedLocations  || []).map((l: any) => l.name ?? l.value ?? l);

    this.audienceState.setSelection({
      allEmployees: this.allEmployees,
      departmentIds: deptIds,
      positionIds: posIds,
      cities
    });
    this.persistSelection();
    this.router?.navigate(['/lanch-survey/step2']);

    console.log('Step1 selection saved:', this.audienceState.getSelection());
  }

  onCancel() {
    console.log('Survey creation cancelled');
     this.router.navigate(['/active-templates']);
  }

  persistSelection() {
    this.audienceState.setSelection({
      allEmployees: this.allEmployees,
      departmentIds: this.byDepartment ? this.selectedDepartments : [],
      positionIds:   this.byPosition   ? this.selectedPositions   : [],
      cities:        this.byLocation   ? this.selectedLocations   : []
    });
  }

  private restorePreviousSelection(): void {
    const saved = this.audienceState.getSelection();
    if (saved) {
      this.allEmployees = saved.allEmployees;
      this.byDepartment = saved.departmentIds?.length > 0;
      this.byLocation = saved.cities?.length > 0;
      this.byPosition = saved.positionIds?.length > 0;

      this.selectedDepartments = saved.departmentIds || [];
      this.selectedPositions = saved.positionIds || [];
      this.selectedLocations = saved.cities || [];
    }
  }

  private loadLookups() {
    this.loading = true;
    this.error = undefined;

    Promise.all([
      this.lookups.getDepartments(true).toPromise(),
      this.lookups.getLocations(true).toPromise(),
      this.lookups.getPositions(true).toPromise()
    ]).then(([depts, locs, pos]) => {
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

 
  get segmentingDisabled(): boolean {
    return this.allEmployees;
  }

  get allDisabled(): boolean {
    return this.byDepartment || this.byLocation || this.byPosition;
  }

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

}