import { Component, OnInit } from '@angular/core';
import { TemplateDetailComponent } from "../../Template-Mang/template-detail/template-detail.component";
import { SummaryCardsComponent } from "../summary-cards/summary-cards.component";
import { EmployeeFilterComponent } from "../employee-filter/employee-filter.component";
import { ActivatedRoute } from '@angular/router';
import { SurveyNavbarComponent } from "../../Survey-Manag/survey-navbar/survey-navbar.component";
import { SurveyOutDto, SurveyService } from '../../../services/SurveyService';
import { SurveyViewAnswerComponent } from "../viewanswer/viewanswer.component";


@Component({
  selector: 'app-view-response',
  imports: [SummaryCardsComponent, EmployeeFilterComponent, SurveyNavbarComponent, SurveyViewAnswerComponent],
  templateUrl: './view-response.component.html',
  styleUrl: './view-response.component.css'
})
export class ViewResponseComponent implements OnInit {
title = '';
  surveyId?: string;

  constructor(
    private route: ActivatedRoute,
    private surveyApi: SurveyService
  ) {}

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.surveyId) {
      this.surveyApi.getById(this.surveyId).subscribe({
        next: (survey: SurveyOutDto) => {
          this.title = survey.name; // The title from your backend
        },
        error: (err) => {
          this.title = 'Survey not found';
        }
      });
    }
  }
}
