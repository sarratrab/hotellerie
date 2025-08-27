import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurveyNavbarComponent } from "../survey-navbar/survey-navbar.component";
import { TemplateNavbarComponent } from "../template-navbar/template-navbar.component";
import { Router, RouterLink } from '@angular/router';
import { TypeServiceService } from '../../services/type-service.service';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";

@Component({
  selector: 'app-add-type',
  imports: [
    CommonModule,
    FormsModule,
    SurveyNavbarComponent,
    TemplateNavbarComponent,
    RouterLink,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './add-type.component.html',
  styleUrl: './add-type.component.css'
})
export class AddTypeComponent {

  constructor(
    private messageService: MessageService,
    private svc: TypeServiceService,
    private router: Router,
  ) {}

  surveyTypeName = '';
  selectedColor = '#3B82F6';

  presetColors: string[] = [
    '#5b21b6', 
    '#40dbaa', 
    '#ea580c', 
    '#7c3aed', 
    '#dc2626', 
    '#0891b2', 
    '#ec4899', 
    '#3b82f6',
  ];

  selectColor(color: string) {
    if (!color?.startsWith('#')) color = `#${color}`;
    this.selectedColor = color.toUpperCase();
  }

  onColorChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.selectColor(input.value || '#000000');
  }


  private get isHexValid(): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(this.selectedColor);
  }

  submit() {
    const name = this.surveyTypeName.trim();
    if (!name || !this.isHexValid) return;

    this.svc.create({ name, color: this.selectedColor }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Template saved successfully!'
        });
        this.router.navigate(["/preferences"]);
      },
      error: (err) => {
        console.error('Failed to create type:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save type.'
        });
      },
    });
  }
}
