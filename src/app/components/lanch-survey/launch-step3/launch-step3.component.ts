import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface LaunchStep3Settings {
  allowAnonymousResponse: boolean;
  sendNotificationMail: boolean;
  expirationDate: string;
}

@Component({
  selector: 'app-launch-step3',
  imports: [CommonModule,FormsModule],
  templateUrl: './launch-step3.component.html',
  styleUrls: ['./launch-step3.component.css']
})
export class LaunchStep3Component implements OnInit {
  
  // Form properties
  allowAnonymousResponse = false;
  sendNotificationMail = false;
  expirationDate = '';

  // Event emitters
  @Output() settingsChanged = new EventEmitter<LaunchStep3Settings>();
  @Output() validationChanged = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
    // Initialize with default values if needed
    this.setDefaultExpirationDate();
    this.emitSettings();
  }

  /**
   * Set default expiration date (e.g., 30 days from now)
   */
  setDefaultExpirationDate(): void {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    this.expirationDate = this.formatDateForInput(defaultDate);
  }

  /**
   * Format date for HTML date input (YYYY-MM-DD)
   */
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Handle anonymous response checkbox change
   */
  onAllowAnonymousChange(): void {
    this.emitSettings();
    this.validateForm();
  }

  /**
   * Handle notification mail checkbox change
   */
  onSendNotificationChange(): void {
    this.emitSettings();
    this.validateForm();
  }

  /**
   * Handle expiration date change
   */
  onExpirationDateChange(): void {
    this.emitSettings();
    this.validateForm();
  }

  /**
   * Emit current settings to parent component
   */
  emitSettings(): void {
    const settings: LaunchStep3Settings = {
      allowAnonymousResponse: this.allowAnonymousResponse,
      sendNotificationMail: this.sendNotificationMail,
      expirationDate: this.expirationDate
    };
    this.settingsChanged.emit(settings);
  }

  /**
   * Validate the form and emit validation status
   */
  validateForm(): void {
    const isValid = this.isFormValid();
    this.validationChanged.emit(isValid);
  }

  /**
   * Check if the form is valid
   */
  isFormValid(): boolean {
    // Check if expiration date is provided and is in the future
    if (!this.expirationDate) {
      return false;
    }

    const selectedDate = new Date(this.expirationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    return selectedDate >= today;
  }

  /**
   * Get current form data
   */
  getFormData(): LaunchStep3Settings {
    return {
      allowAnonymousResponse: this.allowAnonymousResponse,
      sendNotificationMail: this.sendNotificationMail,
      expirationDate: this.expirationDate
    };
  }

  /**
   * Set form data (useful for loading saved settings)
   */
  setFormData(data: Partial<LaunchStep3Settings>): void {
    if (data.allowAnonymousResponse !== undefined) {
      this.allowAnonymousResponse = data.allowAnonymousResponse;
    }
    if (data.sendNotificationMail !== undefined) {
      this.sendNotificationMail = data.sendNotificationMail;
    }
    if (data.expirationDate) {
      this.expirationDate = data.expirationDate;
    }

    this.emitSettings();
    this.validateForm();
  }

  /**
   * Reset form to default values
   */
  resetForm(): void {
    this.allowAnonymousResponse = false;
    this.sendNotificationMail = false;
    this.setDefaultExpirationDate();
    this.emitSettings();
    this.validateForm();
  }

  /**
   * Get minimum date for date input (today)
   */
  getMinDate(): string {
    return this.formatDateForInput(new Date());
  }

  /**
   * Check if expiration date is valid
   */
  isExpirationDateValid(): boolean {
    if (!this.expirationDate) return false;
    
    const selectedDate = new Date(this.expirationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
  }

  /**
   * Get expiration date error message
   */
  getExpirationDateError(): string {
    if (!this.expirationDate) {
      return 'Expiration date is required';
    }
    if (!this.isExpirationDateValid()) {
      return 'Expiration date must be today or in the future';
    }
    return '';
  }

  /**
   * Format date for display (MM/DD/YYYY)
   */
  formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  }

  /**
   * Get summary of current settings
   */
  getSettingsSummary(): string[] {
    const summary: string[] = [];
    
    if (this.allowAnonymousResponse) {
      summary.push('Anonymous responses allowed');
    }
    
    if (this.sendNotificationMail) {
      summary.push('Notification emails will be sent');
    }
    
    if (this.expirationDate) {
      summary.push(`Expires on ${this.formatDateForDisplay(this.expirationDate)}`);
    }
    
    return summary;
  }
}