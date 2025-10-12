import { Component, OnInit, } from '@angular/core';
import { SurveyOutDto, SurveyService } from '../../../services/SurveyService';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common'; 
import { SurveyStats } from '../../../models/interfaces/SurveyStats';
import { ResponseService } from '../../../services/response.service';
@Component({
  selector: 'app-summary-cards',
  imports: [DatePipe],
  templateUrl: './summary-cards.component.html',
  styleUrl: './summary-cards.component.css'
})
export class SummaryCardsComponent implements OnInit {
  title = '';
  surveyId?: string;
  startdate = '';
  enddate = '';
  totalEmployees = 0;
  responded = 0;
  inProgress = 0;
  notOpened = 0;

  stats?: SurveyStats;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private surveyApi: SurveyService,
    private ressvc: ResponseService 
  ) {}

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get('id') ?? undefined;
    console.log('SurveyId from route:', this.surveyId);
    if (this.surveyId) {
      this.loadStats();
      this.loadSurveyInfo();
    }
  }

  loadSurveyInfo() {
    this.surveyApi.getById(this.surveyId!).subscribe({
      next: (survey: SurveyOutDto) => {
        this.title = survey.name;
        this.startdate = survey.createdOn;
        this.enddate = survey.deadline;
      },
      error: () => {
        this.title = 'Survey not found';
      }
    });
  }

  loadStats() {
    this.loading = true;
    this.ressvc.getSurveyStats(this.surveyId!).subscribe({
      next: (res) => {
        this.stats = res;
        this.totalEmployees = res.totalEmployees;
        this.responded = res.responded;
        this.inProgress = res.inProgress;
        this.notOpened = res.notOpened;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load stats', err);
        this.loading = false;
      }
    });
  }
}
