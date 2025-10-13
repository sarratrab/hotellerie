import { Component, OnInit } from '@angular/core';
import { SummaryCardsComponent } from "../summary-cards/summary-cards.component";
import { EmployeeFilterComponent } from "../employee-filter/employee-filter.component";
import { ActivatedRoute } from '@angular/router';
import { SurveyNavbarComponent } from "../../Survey-Manag/survey-navbar/survey-navbar.component";
import { SurveyOutDto, SurveyService } from '../../../services/SurveyService';
import { SurveyViewAnswerComponent } from "../viewanswer/viewanswer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-view-response',
  imports: [
    SummaryCardsComponent,
    EmployeeFilterComponent,
    FormsModule,
    SurveyNavbarComponent,
    SurveyViewAnswerComponent,
    CommonModule,
  ],
  templateUrl: './view-response.component.html',
  styleUrl: './view-response.component.css'
})
export class ViewResponseComponent implements OnInit {
title = '';
surveyId?: string;
 emailFilter: string = '';

  onEmailFilterChange(newEmail: string) {
    this.emailFilter = newEmail;
  }
  constructor(
    private route: ActivatedRoute,
    private surveyApi: SurveyService
  ) {}

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.surveyId) {
      this.surveyApi.getById(this.surveyId).subscribe({
        next: (survey: SurveyOutDto) => {
          this.title = survey.name; 
        },
        error: (err) => {
          this.title = 'Survey not found';
        }
      });
    }
  }
}
