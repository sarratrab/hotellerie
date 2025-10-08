import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { CommonModule } from '@angular/common';

type Status = 'PENDING' | 'IN PROGRESS';

interface SurveyCard {
  title: string;
  description: string;
  minutes: number;
  // Active
  due?: Date;
  progress?: number;          // 0..100 (active)
  status?: Status;            // active status
  // Completed
  completedOn?: Date;
  tag?: 'TRAINING' | 'PERFORMANCE' | undefined;
}
@Component({
  selector: 'app-survey-employee',
  imports: [NavbarComponent,CommonModule],
  templateUrl: './survey-employee.component.html',
  styleUrl: './survey-employee.component.css'
})
export class SurveyEmployeeComponent {

   activeSurveys: SurveyCard[] = [
    {
      title: 'Q1 2025 Employee Satisfaction',
      description: 'Help us understand your experience and satisfaction with your current role and work environment.',
      due: new Date(2025, 0, 30),
      minutes: 5,
      status: 'PENDING'
    },
    {
      title: 'Team Collaboration Assessment',
      description: 'Share your thoughts on team dynamics and collaboration within your department.',
      due: new Date(2025, 1, 5),
      minutes: 8,
      status: 'PENDING'
    },
    {
      title: 'Workplace Culture Evaluation',
      description: 'Assess our company culture and suggest improvements for a better work environment.',
      due: new Date(2025, 0, 28),
      minutes: 10,
      progress: 65,
      status: 'IN PROGRESS'
    }
  ];

  completedSurveys: SurveyCard[] = [
    {
      title: 'Year-End Review Survey',
      description: 'Annual review of company policies, benefits, and overall employee experience.',
      completedOn: new Date(2024, 11, 15),
      minutes: 12
    },
    {
      title: 'Remote Work Effectiveness',
      description: 'Evaluation of remote work policies and tools effectiveness during Q4 2024.',
      completedOn: new Date(2024, 10, 22),
      minutes: 7,
      tag: 'TRAINING'
    }
  ];

  statusClass(s?: Status) {
    if (s === 'PENDING') return 'chip-red';
    if (s === 'IN PROGRESS') return 'chip-amber';
    return '';
    }
}

