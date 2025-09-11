import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from "primeng/dropdown";

export interface Employee {
  id: number;
  name: string;
  title?: string;
  department?: string;
  manager?: string;
}

@Component({
  selector: 'app-employee-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CheckboxModule, InputTextModule, DropdownModule],
  templateUrl: './employee-selector.component.html',
  styleUrls: ['./employee-selector.component.css']
})
export class EmployeeSelectorComponent {
   employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedEmployees: Employee[] = [];
  allEmployees: Employee[] = [];
  
  totalEmployees = 264;
  selectedCount = 212;
  
  searchTerm = '';
  selectedFilter = '';
  
  filterOptions = [
    { label: 'All employee', value: 'All employee' },
    { label: 'Selected', value: 'selected' },
    { label: 'Available', value: 'available' }
  ];

  ngOnInit() {
    this.loadEmployees();
    this.filteredEmployees = [...this.employees];
    this.selectedCount = this.selectedEmployees.length;
  }

  loadEmployees() {
    // Sample data - replace with your actual data source
    this.allEmployees = [
      { id: 1, name: 'Yasmine', title: 'Software Engineer', department: 'IT', manager: 'John Smith' },
      { id: 2, name: 'Ahmed', title: 'Product Manager', department: 'Product', manager: 'Sarah Johnson' },
      { id: 3, name: 'Yousine', title: 'Designer', department: 'Design', manager: 'Mike Wilson' },
      { id: 4, name: 'Yasmine', title: 'Data Analyst', department: 'Analytics', manager: 'Lisa Brown' },
      { id: 5, name: 'Ameni', title: 'Marketing Specialist', department: 'Marketing', manager: 'David Lee' },
      { id: 6, name: 'Mohamed', title: 'DevOps Engineer', department: 'IT', manager: 'John Smith' },
      { id: 7, name: 'Employee 1', title: '', department: '', manager: '' },
      { id: 8, name: 'Employee 2', title: '', department: '', manager: '' },
      { id: 9, name: 'Employee 3', title: '', department: '', manager: '' },
      { id: 10, name: 'Employee 4', title: '', department: '', manager: '' },
      { id: 11, name: 'Employee 5', title: '', department: '', manager: '' },
      { id: 12, name: 'Employee 6', title: '', department: '', manager: '' },
      { id: 13, name: 'Employee 7', title: '', department: '', manager: '' }
    ];

    // Pre-select some employees to match the "212 of 264" count
    this.employees = [...this.allEmployees];
    this.selectedEmployees = this.employees.slice(0, 7); // Pre-select first 7 for demo
  }

  onGlobalFilter(table: any, event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.applyFilters();
  }

  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedFilter = target.value;
    this.applyFilters();
  }

  applyFilters() {
 let filtered = [...this.employees];

    // search
    const q = this.searchTerm.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.title ?? '').toLowerCase().includes(q) ||
        (e.department ?? '').toLowerCase().includes(q) ||
        (e.manager ?? '').toLowerCase().includes(q)
      );
    }

    // dropdown filter
    if (this.selectedFilter === 'selected') {
      filtered = filtered.filter(e => this.isSelected(e));
    } else if (this.selectedFilter === 'available') {
      filtered = filtered.filter(e => !this.isSelected(e));
    }

    this.filteredEmployees = filtered;
  }
  trackById(_: number, e: Employee) { return e.id; }

  onEmployeeSelect(employee: Employee, event: Event) {
    const target = event.target as HTMLInputElement;
    
    if (target.checked) {
      // Add to selection if not already selected
      if (!this.isSelected(employee)) {
        this.selectedEmployees.push(employee);
      }
    } else {
      // Remove from selection
      this.selectedEmployees = this.selectedEmployees.filter(e => e.id !== employee.id);
    }

    this.updateSelectedCount();
  }

  onSelectAll(event: Event) {
    const target = event.target as HTMLInputElement;
    
    if (target.checked) {
      // Select all filtered employees
      this.filteredEmployees.forEach(employee => {
        if (!this.isSelected(employee)) {
          this.selectedEmployees.push(employee);
        }
      });
    } else {
      // Deselect all filtered employees
      this.selectedEmployees = this.selectedEmployees.filter(selected => 
        !this.filteredEmployees.find(filtered => filtered.id === selected.id)
      );
    }

    this.updateSelectedCount();
  }

  isSelected(employee: Employee): boolean {
    return this.selectedEmployees.some(selected => selected.id === employee.id);
  }

  isAllSelected(): boolean {
    return this.filteredEmployees.length > 0 && 
           this.filteredEmployees.every(employee => this.isSelected(employee));
  }

  isIndeterminate(): boolean {
    const selectedCount = this.filteredEmployees.filter(employee => this.isSelected(employee)).length;
    return selectedCount > 0 && selectedCount < this.filteredEmployees.length;
  }

  updateSelectedCount() {
    this.selectedCount = this.selectedEmployees.length;
  }

  getSelectedEmployeesCount(): string {
    return `Selected Employees (${this.selectedCount} of ${this.totalEmployees})`;
  }

  onCancel() {
    // Handle cancel action - could emit event or navigate back
    console.log('Cancel clicked');
  }

  onNext() {
    // Handle next action - could emit selected employees or navigate forward
    console.log('Next clicked with selected employees:', this.selectedEmployees);
  }

  // Utility methods for UI state
  getCheckboxState(employee: Employee) {
    return this.isSelected(employee);
  }

  getHeaderCheckboxState() {
    if (this.isAllSelected()) return 'checked';
    if (this.isIndeterminate()) return 'indeterminate';
    return 'unchecked';
  }

  // Method to add/remove employees programmatically
  addEmployee(employee: Employee) {
    if (!this.employees.find(e => e.id === employee.id)) {
      this.employees.push(employee);
      this.applyFilters();
    }
  }

  removeEmployee(employeeId: number) {
    this.employees = this.employees.filter(e => e.id !== employeeId);
    this.selectedEmployees = this.selectedEmployees.filter(e => e.id !== employeeId);
    this.applyFilters();
    this.updateSelectedCount();
  }

  // Method to load employees from API
  async loadEmployeesFromApi() {
    try {
      // Replace with your actual API call
      // const response = await this.employeeService.getEmployees();
      // this.allEmployees = response.data;
      // this.employees = [...this.allEmployees];
      // this.applyFilters();
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  // Method to save selection
  async saveSelection() {
    try {
      // Replace with your actual API call
      // await this.employeeService.saveSelectedEmployees(this.selectedEmployees);
      console.log('Selection saved:', this.selectedEmployees);
    } catch (error) {
      console.error('Error saving selection:', error);
    }
  }
}