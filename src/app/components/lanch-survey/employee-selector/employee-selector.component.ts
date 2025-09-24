import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from "primeng/dropdown";
import { EmployeeRow } from '../../../models/interfaces/EmployeeRow';
import { EmployeeApiService } from '../../../services/employee-api.service';
import { AudienceStateService } from '../../../services/audience-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../../services/SurveyService';

@Component({
  selector: 'app-employee-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CheckboxModule, InputTextModule, DropdownModule],
  templateUrl: './employee-selector.component.html',
  styleUrls: ['./employee-selector.component.css']
})
export class EmployeeSelectorComponent implements OnInit {

  employees: EmployeeRow[] = [];
  filteredEmployees: EmployeeRow[] = [];
  selectedEmployees: EmployeeRow[] = [];
  totalEmployees = 0;
  selectedCount = 0;
  searchTerm = '';
  selectedFilter = '';
  surveyId: string | undefined;
  error?: string;
  loading = false;
  success?: string;

  constructor(
    private employeeApi: EmployeeApiService,
    private audienceState: AudienceStateService,
    private router: Router,
    private route: ActivatedRoute,
    private wizard: AudienceStateService,
    private surveyApi: SurveyService,
  ) {}

  ngOnInit() {
     // get surveyId from parent route
  this.surveyId = this.route.parent?.snapshot.paramMap.get('id') ?? undefined;
    const filters = this.audienceState.getSelection();
    this.employeeApi.getForSelection(filters).subscribe({
      
      next: (rows) => {
          console.log("Backend rows:", rows.slice(0, 5)); // first 5 only
    console.log("Filters passed:", filters);

        this.employees = rows;
        this.totalEmployees = rows.length;
        this.selectedEmployees = rows.filter(r => r.isSelected);   
        this.selectedCount = this.selectedEmployees.length;
        this.filteredEmployees = [...this.employees];
      },
      error: (err) => console.error('Load employees failed', err)
    });
    
  }

  onEmployeeSelect(employee: EmployeeRow, ev: Event) {
    const checked = (ev.target as HTMLInputElement)?.checked ?? false;

    if (checked) {
      if (!this.isSelected(employee)) this.selectedEmployees.push(employee);
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(x => x.id !== employee.id);
    }

    this.updateSelectedCount();
  }

  onSelectAll(ev: Event) {
    const checked = (ev.target as HTMLInputElement)?.checked ?? false;

    if (checked) {
      this.filteredEmployees.forEach(e => {
        if (!this.isSelected(e)) this.selectedEmployees.push(e);
      });
    } else {
      const ids = new Set(this.filteredEmployees.map(e => e.id));
      this.selectedEmployees = this.selectedEmployees.filter(sel => !ids.has(sel.id));
    }

    this.updateSelectedCount();
  }

  onGlobalFilter(_table: any, ev: Event) {
    const v = (ev.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = v;
    this.applyFilters();
  }

  onFilterChange(ev: Event) {
    this.selectedFilter = (ev.target as HTMLSelectElement).value;
    this.applyFilters();
  }
/*

// hedhi kenet the second one , tawa walet a5er wahda , fyha el submit 
  onNext() {
    const ids = this.selectedEmployees.map(e => e.id);
    this.audienceState.setSelectedEmployees(ids);
     this.router.navigate([`/lanch-survey/${this.surveyId}/step3`]);
  }*/

       


  onCancel() {
    this.router.navigate(['/lanch-survey/step2']);
  }

  updateSelectedCount() {
    this.selectedCount = this.selectedEmployees.length;
  }

  applyFilters() {
    let rows = [...this.employees];

    if (this.searchTerm) {
      const s = this.searchTerm;
      rows = rows.filter(e =>
        (e.name?.toLowerCase().includes(s)) ||
        (e.title?.toLowerCase().includes(s)) ||
        (e.department?.toLowerCase().includes(s)) ||
        (e.manager?.toLowerCase().includes(s)) ||
        (e.city?.toLowerCase().includes(s))
      );
    }

    if (this.selectedFilter === 'selected') {
      rows = rows.filter(e => this.isSelected(e));
    } else if (this.selectedFilter === 'available') {
      rows = rows.filter(e => !this.isSelected(e));
    }

    this.filteredEmployees = rows;
  }

  isSelected(e: EmployeeRow): boolean {
    return this.selectedEmployees.some(x => x.id === e.id);
  }

  isAllSelected(): boolean {
    return this.filteredEmployees.length > 0 &&
           this.filteredEmployees.every(e => this.isSelected(e));
  }

  isIndeterminate(): boolean {
    const count = this.filteredEmployees.filter(e => this.isSelected(e)).length;
    return count > 0 && count < this.filteredEmployees.length;
  }

  getSelectedEmployeesCount(): string {
    return `Selected employees (${this.selectedCount} of ${this.totalEmployees})`;
  }

  onNext()
{
  try 
  {
        const ids = this.selectedEmployees.map(e => e.id);
        this.audienceState.setSelectedEmployees(ids);
        const dto = this.wizard.buildAddSurveyDto();
        console.log('[Step3] DTO =', dto);
        console.log('surveyId value:', this.surveyId, 'typeof:', typeof this.surveyId);

       if (this.surveyId !== undefined && this.surveyId !== null && this.surveyId !== 'undefined') {
      // --- EDIT MODE ---
      this.surveyApi.updateSurvey(this.surveyId, dto).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Survey updated successfully';
          this.router.navigate(['/surveys']);
        },
        error: (err: { error: { message: any; }; statusText: any; }) => {
          this.loading = false;
          const detail = err?.error?.message || err?.error || err?.statusText || 'Bad Request';
          this.error = `Failed to update survey: ${detail}`;
          console.error('Update survey error:', err);
        }
      });

    } else {
      // --- ADD MODE ---
      this.surveyApi.addSurvey(dto).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Survey created successfully';
          this.router.navigate(['/surveys']);
        },
        error: (err) => {
          this.loading = false;
          const detail = err?.error?.message || err?.error || err?.statusText || 'Bad Request';
          this.error = `Failed to create survey: ${detail}`;
          console.error('Create survey error:', err);
        }
      });
    }

      } catch (e: any) {
        this.loading = false;
        this.error = e?.message || 'Invalid data';
        console.warn('Client-side validation failed:', e);
      }
}
  

}