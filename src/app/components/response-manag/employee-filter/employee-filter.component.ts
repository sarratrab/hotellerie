import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-filter',
  imports: [FormsModule],
  templateUrl: './employee-filter.component.html',
  styleUrl: './employee-filter.component.css'
})
export class EmployeeFilterComponent implements OnInit {
   @Input() employeeEmails: string[] = [];
  @Output() filterChange = new EventEmitter<string>();
  
  emailFilter: string = '';
  currentIndex: number = -1;

  ngOnInit(): void {
     this.loadEmployeeEmails();
  }
 loadEmployeeEmails() {
    // Replace this with your actual API call to get employee emails
    // Example:
    // this.surveyApi.getEmployeeEmails(this.surveyId).subscribe({
    //   next: (emails) => {
    //     this.employeeEmails = emails;
    //   }
    // });
    
    // Temporary mock data:
    this.employeeEmails = [
      'employee1@example.com',
      'employee2@example.com',
      'employee3@example.com'
    ];
  }

  onFilterChange(email: string) {
    this.emailFilter = email;
  }
  clearFilter() {
    this.emailFilter = '';
    this.currentIndex = -1;
    this.filterChange.emit(this.emailFilter);
  }

  previousEmployee() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.emailFilter = this.employeeEmails[this.currentIndex];
      this.filterChange.emit(this.emailFilter);
    } else if (this.emailFilter && this.currentIndex === -1) {
      const index = this.employeeEmails.indexOf(this.emailFilter);
      if (index > 0) {
        this.currentIndex = index - 1;
        this.emailFilter = this.employeeEmails[this.currentIndex];
        this.filterChange.emit(this.emailFilter);
      }
    }
  }

  nextEmployee() {
    if (this.currentIndex < this.employeeEmails.length - 1) {
      this.currentIndex++;
      this.emailFilter = this.employeeEmails[this.currentIndex];
      this.filterChange.emit(this.emailFilter);
    } else if (!this.emailFilter || this.currentIndex === -1) {
      this.currentIndex = 0;
      this.emailFilter = this.employeeEmails[0];
      this.filterChange.emit(this.emailFilter);
    }
  }

  onSelectChange() {
    const index = this.employeeEmails.indexOf(this.emailFilter);
    this.currentIndex = index;
    this.filterChange.emit(this.emailFilter);
  }

  hasPrevious(): boolean {
    if (!this.emailFilter) return false;
    const index = this.employeeEmails.indexOf(this.emailFilter);
    return index > 0;
  }

  hasNext(): boolean {
    if (this.employeeEmails.length === 0) return false;
    if (!this.emailFilter) return true;
    const index = this.employeeEmails.indexOf(this.emailFilter);
    return index < this.employeeEmails.length - 1;
  }

  
}
