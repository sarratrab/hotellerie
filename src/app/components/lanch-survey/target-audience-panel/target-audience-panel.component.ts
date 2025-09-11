import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';


import {  OnInit } from '@angular/core';
import { LanchSurveyComponent } from '../lanch-survey/lanch-survey.component';
import { LanchSurveyFooterComponent } from '../lanch-survey-footer/lanch-survey-footer.component';

interface EmployeeOption {
  id: number;
  name: string;
}
@Component({
  selector: 'app-target-audience-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectModule, CalendarModule, CheckboxModule, ButtonModule],
  templateUrl: './target-audience-panel.component.html',
  styleUrls: ['./target-audience-panel.component.css']
})
export class TargetAudiencePanelComponent {

  // Checkboxes
  allEmployees = false;
  byLocation = false;
  byDepartment = false;
  byPosition = false;

  // Selected values
  selectedLocations: any[] = [];
  selectedDepartments: any[] = [];
  selectedPositions: any[] = [];

  // Options
  locationOptions = [
    { name: 'New York Office', value: 'ny' },
    { name: 'London Office', value: 'london' },
    { name: 'Tokyo Office', value: 'tokyo' }
  ];
  departmentOptions = [
    { name: 'Engineering', value: 'eng' },
    { name: 'Sales', value: 'sales' },
    { name: 'Marketing', value: 'marketing' },
    { name: 'HR', value: 'hr' }
  ];
  positionOptions = [
    { name: 'Senior Manager', value: 'senior_manager' },
    { name: 'Developer', value: 'developer' },
    { name: 'Designer', value: 'designer' },
    { name: 'Analyst', value: 'analyst' }
  ];

  // ----- computed helpers -----
  get segmentingDisabled(): boolean {
    return this.allEmployees; // disable dept/location/position blocks
  }
  get allDisabled(): boolean {
    return this.byDepartment || this.byLocation || this.byPosition; // disable AllEmployees
  }

  // ----- handlers -----
  onToggleAll(checked: boolean) {
    this.allEmployees = checked;
    if (checked) {
      // lock and clear the three segments
      this.byDepartment = this.byLocation = this.byPosition = false;
      this.selectedDepartments = [];
      this.selectedLocations = [];
      this.selectedPositions = [];
    }
  }

  onToggleSegment(kind: 'dept' | 'loc' | 'pos', checked: boolean) {
    if (kind === 'dept') {
      this.byDepartment = checked;
      if (!checked) this.selectedDepartments = [];
    }
    if (kind === 'loc') {
      this.byLocation = checked;
      if (!checked) this.selectedLocations = [];
    }
    if (kind === 'pos') {
      this.byPosition = checked;
      if (!checked) this.selectedPositions = [];
    }

    if (checked) {
      // any segment active -> cannot be All Employees
      this.allEmployees = false;
    }
  }

  // Summary (inchangé sauf logique mutualisée)
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
    // 👉 you can navigate back or reset form
  }

  onNext() {
    console.log('Next step clicked');
    console.log('All Employees:', this.allEmployees);
    console.log('By Location:', this.selectedLocations);
    console.log('By Department:', this.selectedDepartments);
    console.log('By Position:', this.selectedPositions);

    // 👉 you can navigate to next child route (step2) here
    // this.router.navigate(['/lanch-survey/step2']);
  }
}
  

