import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

type AudienceOption = { label: string; value: string };

@Component({
  selector: 'app-target-audience-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectModule, CalendarModule, CheckboxModule, ButtonModule],
  templateUrl: './target-audience-panel.component.html',
  styleUrls: ['./target-audience-panel.component.css']
})
export class TargetAudiencePanelComponent {
  audienceOptions: AudienceOption[] = [
    { label: 'All Employees', value: 'all' },
    { label: 'HR Department', value: 'hr' },
    { label: 'Finance Department', value: 'finance' },
    { label: 'Engineering', value: 'eng' },
    { label: 'Sales', value: 'sales' },
    { label: 'Marketing', value: 'mkt' },
  ];

  selectedAudience: string[] = ['all', 'hr', 'finance']; // preselected like the mock
  expirationDate: Date | null = null;

  allowAnonymous = false;
  sendNotification = false;

 minDate: Date = new Date(); // Today's date
  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 5)); // 5 years from now
//Add these methods (optional - you can remove the event handlers if not needed)
  getValidationClass(fieldName: string): string {
    // Simple implementation - customize as needed
    return '';
  }

  getFieldError(fieldName: string): string {
    // Simple implementation - customize as needed
    return '';
  }

  onAudienceChange(event: any): void {
    // Handle audience selection changes if needed
  }

  onDateChange(event: any): void {
    // Handle date changes if needed
  }

  onAnonymousChange(event: any): void {
    // Handle anonymous toggle if needed
  }

  onNotificationChange(event: any): void {
    // Handle notification toggle if needed
  }

  getYearRange(): string {
    const currentYear = new Date().getFullYear();
    return `${currentYear}:${currentYear + 10}`;
  }

  resetForm(): void {
    this.selectedAudience = [];
    this.expirationDate = null;
    this.allowAnonymous = false;
    this.sendNotification = false;
  }

  saveConfiguration(): void {
    // Implement your save logic here
    console.log('Saving configuration...');
  }
}


  

