import { Component, computed, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
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
import { SurveyOutDto, SurveyService } from '../../services/SurveyService';
import { TemplateService } from '../../services/template-services.service';
import { map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

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

EditSurvey() {
  const id = this.activeCardMenu() ?? this.selectedCard()?.id;
  if (!id) return;

  this.activeCardMenu.set(null);

  this.router.navigate([`/lanch-survey/${id}/step1`]);
}

  @ViewChild('menu') menu!: TieredMenu;

  items: MenuItem[] = [];
  typeOptions: { value: string; label: string }[] = [];
  ref: DynamicDialogRef | undefined;
  coalesce(v: any, fb: any) { return v === null || v === undefined ? fb : v; }

selectedCard = signal<any | null>(null);
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
  this.surveyService.getAll().pipe(
    map((res: any) => Array.isArray(res) ? res : (res?.data ?? [])),
    switchMap((surveys: SurveyOutDto[]) => forkJoin({
      surveys: of(surveys),
      types : this.templateTypeService.list(),
      templates : this.templateService.getAll()
    })),
    switchMap(({ surveys, templates ,types}) => {
      const templateById = new Map(templates.map(t => [t.templateId, t]));
      const typeById = new Map(types.map(t=> [t.id, t]))
      return forkJoin(
        surveys.map(s =>
          this.templateService.getById(s.templateId).pipe(
            map(tpl => ({
              id: s.surveyId,
              name: s.name,
              description: s.description,
              createdOn: new Date(s.createdOn),
              deadline: new Date(s.deadline),
              isAnonymous: s.isAnonymous,
              typeLabel: templateById.get(s.templateId)?.typeName?? 'Unknown',
              typecolor : typeById.get(templateById.get(s.templateId)!.typeId)?.color,
              sentTo: s.employeeIds.length,
              stats: { completed: 0, notTouched: s.employeeIds.length, inProgress: 0 }
            }))
          )
        )
      );
    })
  ).subscribe(cards => this.surveys.set(cards));
}



  private documentClickListener?: (event: Event) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private templateTypeService: TypeServiceService,
    private messageService: MessageService,
    private dialogService: DialogService,
     private surveyService: SurveyService,
     private templateService:TemplateService
  ) {}

  ngOnInit(): void {
    this.loadSurveys();
    this.items = [
      { label: 'Create a template', command: () => this.router.navigate(['/addtemp']) },
      { label: 'Export to Excel', command: () => console.log('') },
      { label: 'Export to PDF', command: () => console.log('') }
    ];

        this.templateTypeService.list().subscribe({
      next: (types: any[]) => {
        this.typeOptions = types.map(t => ({
          value: t.id,
          label: t.name,
          color: t.color
        }));


      },
      error: err => {
        console.error('Error fetching types:', err);
      }
    });
    
  }

  onComplete() {
    const survey= this.selectedCard();
    this.surveyService.complete(survey!.id).subscribe({
      next: _ => this.loadSurveys(), // refresh la liste -> il disparaît des actifs
      error: err => console.error(err)
    });
    this.activeCardMenu.set(null);
    this.selectedCard.set(null);
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
        !type || survey.typeLabel.toLowerCase() === type.toLowerCase();

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

  toggleCardMenu(event: Event, survey: any): void {
    event.stopPropagation();


    if (this.activeCardMenu() === survey.id) {
      // fermer si déjà ouvert
      this.activeCardMenu.set(null);
      this.selectedCard.set(null);
      return;
    }

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.menuPosition.set({
      x: rect.left - 100,
      y: rect.bottom + 5
    });

    this.activeCardMenu.set(survey.id);
    this.selectedCard.set(survey);
  }
    getTypeColor(survey: any): string {
    return this.normalizeHex(survey?? '#3B82F6');
  }

  typeChipStyle(survey: any) {
    const hex = this.getTypeColor(survey);
    return {
      'background-color': this.tint(hex, 0.85),
      color: hex,
      'border-color': this.tint(hex, 0.7)
    };
  }

  private normalizeHex(c: string): string {
    if (!c) return '#3B82F6';
    c = ('' + c).trim();
    if (!c.startsWith('#')) c = '#' + c;
    if (c.length === 4) {
      c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
    }
    return c.toUpperCase();
  }
    private hexToRgb(hex: string) {
    const h = this.normalizeHex(hex).slice(1);
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return { r, g, b };
  }

  private tint(hex: string, ratio = 0.85): string {
    const { r, g, b } = this.hexToRgb(hex);
    const nr = Math.round(r + (255 - r) * ratio);
    const ng = Math.round(g + (255 - g) * ratio);
    const nb = Math.round(b + (255 - b) * ratio);
    return `rgb(${nr}, ${ng}, ${nb})`;
  }
    closeMenu(): void {
  this.activeCardMenu.set(null);
}

  /** Ferme au clic n'importe où dans le document */
@HostListener('document:click')
onDocClick(): void {
  this.closeMenu();
}

/** Ferme avec la touche Échap */
@HostListener('document:keydown.escape', ['$event'])
onEsc(_: KeyboardEvent): void {
  this.closeMenu();
}

/** Ferme si on scrolle ou on redimensionne (optionnel mais UX ++) */
@HostListener('window:scroll')
@HostListener('window:resize')
onWindowMove(): void {
  if (this.activeCardMenu()) this.closeMenu();
}

}
