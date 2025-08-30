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
Next() {
throw new Error('Method not implemented.');
}
// Checkboxes
  allEmployees: boolean = false;
  byLocation: boolean = false;
  byDepartment: boolean = false;
  byPosition: boolean = false;

  // MultiSelect options
  employeeOptions: EmployeeOption[] = [];

  // Selected values
  selectedLocations: EmployeeOption[] = [];
  selectedDepartments: EmployeeOption[] = [];
  selectedPositions: EmployeeOption[] = [];

  constructor() {}

  ngOnInit(): void {
    // Mock data (you can replace with API call)
    this.employeeOptions = [
      { id: 1, name: 'All Employees' },
      { id: 2, name: 'HR Department' },
      { id: 3, name: 'Finance Department' },
      { id: 4, name: 'IT Department' },
      { id: 5, name: 'Marketing Department' }
    ];
  }

  // Add these properties to your component
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
// Add this method for the summary
getSelectionSummary(): string {
  const selections = [];
  
  if (this.allEmployees) {
    return 'This survey will be sent to all employees in your organization.';
  }
  
  if (this.byLocation && this.selectedLocations?.length) {
    selections.push(`${this.selectedLocations.length} location(s)`);
  }
  
  if (this.byDepartment && this.selectedDepartments?.length) {
    selections.push(`${this.selectedDepartments.length} department(s)`);
  }
  
  if (this.byPosition && this.selectedPositions?.length) {
    selections.push(`${this.selectedPositions.length} position(s)`);
  }
  
  if (selections.length === 0) return '';
  
  return `This survey will be sent to employees in: ${selections.join(', ')}.`;
}}

  

