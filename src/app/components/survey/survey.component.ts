import { Component, computed, Inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { SurveyNavbarComponent } from "../survey-navbar/survey-navbar.component";
import { TemplateNavbarComponent } from "../template-navbar/template-navbar.component";
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TemplateBase } from '../../models/interfaces/templateBase';
import { Router } from '@angular/router';
import { TypeServiceService } from '../../services/type-service.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-survey',
    imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SurveyNavbarComponent,
    TieredMenuModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.css'
})
export class SurveyComponent implements OnInit{

  @ViewChild('menu') menu!: TieredMenu;

  items: MenuItem[] = [];
  typeOptions: { value: string; label: string }[] = [];
  ref: DynamicDialogRef | undefined;
  coalesce(v: any, fb: any) { return v === null || v === undefined ? fb : v; }


  searchTerm = signal<string>('');
  selectedYear = signal<string>('2025');
  selectedType = signal<string>('');
  surveys = signal<any[]>([]);
  activeCardMenu = signal<string | null>(null);
  menuPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  isOverdue(s: any): boolean {
  if (!s?.deadline) return false;
  const due = new Date(s.deadline).getTime();
  return due < Date.now();
}

isDueSoon(s: any, days = 7): boolean {
  if (!s?.deadline) return false;
  const due = new Date(s.deadline).getTime();
  const now = Date.now();
  return due >= now && (due - now) <= days * 86400000;
}


  totalSurveys = computed(() => this.filteredSurveys().length);
    private loadSurveys(): void {
    // Mock data - replace with actual API call
    const mockSurveys: any[] = [
     {
    id: '1',
    name: 'Employee Engagement Q1',
    description: 'Comprehensive quarterly assessment measuring employee engagement, workplace satisfaction, and overall job fulfillment across all departments.',
    type: 'HR Survey',
    createdOn: new Date('2025-01-15'),
    createdBy: 'Jane Doe',
    usage_status: 1,
    active_status: 1,
    deadline: new Date(2025, 0, 30),
    sentTo: 235,
    estimatedMins: 7,
    // extra purely front:
    ...( {
      typeLabel: 'HR Survey',
      isAnonymous: true,
      stats: { completed: 120, notTouched: 80, inProgress: 35 }
    } as any )
  },
    ];

    this.surveys.set(mockSurveys);
  }

  private documentClickListener?: (event: Event) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private templateTypeService: TypeServiceService,
    private messageService: MessageService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.loadSurveys();
    this.items = [
      { label: 'Create a template', command: () => this.router.navigate(['/addtemp']) },
      { label: 'Export to Excel', command: () => console.log('') },
      { label: 'Export to PDF', command: () => console.log('') }
    ];

    this.templateTypeService.list().subscribe({
      next: types => {
        console.log('Types:', types);
        this.typeOptions = types.map(t => ({
          value: t.id,
          label: t.name
        }));
      },
      error: err => {
        console.error('Error fetching types:', err);
      }
    });
  }



  filteredSurveys = computed(() => {
    const surveys = this.surveys();
    const search = this.searchTerm().toLowerCase();
    const year = this.selectedYear();
    const type = this.selectedType();

    return surveys.filter(survey => {
      const matchesSearch =
        !search ||
        survey.name.toLowerCase().includes(search) ||
        survey.createdBy.toLowerCase().includes(search) ||
        survey.type.toLowerCase().includes(search) ||
        (survey.usage_status && survey.usage_status);

      const matchesYear =
        !year || survey.createdOn.getFullYear().toString() === year;
      const matchesType =
        !type || survey.type.toLowerCase() === type.toLowerCase();

      return matchesSearch && matchesYear && matchesType;
    });
  });

  toggleMenu(event: Event) {
    this.menu.toggle(event);
  }

  onSearch(): void {
    console.log('Searching for:', this.searchTerm());
  }

  onYearChange(): void {
    console.log('Year filter changed to:', this.selectedYear());
  }

  onTypeChange(): void {
    console.log('Type filter changed to:', this.selectedType());
  }

  toggleCardMenu(event: Event, surveyId: string): void {
    event.stopPropagation();

    if (this.activeCardMenu() === surveyId) {
      this.activeCardMenu.set(null);
    } else {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      this.menuPosition.set({
        x: rect.left - 100,
        y: rect.bottom + 5
      });
      this.activeCardMenu.set(surveyId);
    }
  }
}
