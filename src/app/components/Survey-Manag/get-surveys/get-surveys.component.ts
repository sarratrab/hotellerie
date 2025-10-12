import { Component, computed, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { SurveyNavbarComponent } from "../survey-navbar/survey-navbar.component";

import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Router, ActivatedRoute } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { TypeServiceService } from '../../../services/type-service.service';
import { SurveyOutDto, SurveyService } from '../../../services/SurveyService';
import { TemplateService } from '../../../services/template-services.service';

@Component({
  selector: 'app-get-surveys',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SurveyNavbarComponent,
    TieredMenuModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './get-surveys.component.html',
  styleUrls: ['./get-surveys.component.css']
})
export class GetSurveysComponent implements OnInit, OnDestroy {
  @ViewChild('menu') menu!: TieredMenu;

  items: MenuItem[] = [];
  typeOptions: { value: string; label: string; color?: string }[] = [];
  ref: DynamicDialogRef | undefined;
  coalesce(v: any, fb: any) { return v === null || v === undefined ? fb : v; }

  selectedCard = signal<any | null>(null);
  searchTerm = signal<string>('');
  selectedYear = signal<string>('2025');
  selectedType = signal<string>('');
  surveys = signal<any[]>([]);
  activeCardMenu = signal<string | null>(null);
  menuPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  private typeColorById = new Map<string, string>();
  private typeLabelById = new Map<string, string>();

  isOpenPage = true; // ✅ true=Survey (open), false=History (completed) - new line

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute, // ✅ new line to read route data
    private templateTypeService: TypeServiceService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private surveyService: SurveyService,
    private templateService : TemplateService
  ) {}

ngOnInit(): void {
  // ✅ Read the correct key from route data
  const status = this.route.snapshot.data['status'] ?? 'open';
  this.isOpenPage = status === 'open';

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
      this.typeColorById = new Map(types.map(t => [t.id, this.normalizeHex(t.color)]));
      this.typeLabelById = new Map(types.map(t => [t.id, t.name]));
    },
    error: err => console.error('Error fetching types:', err)
  });

  this.loadSurveys();
}


  ngOnDestroy(): void {
    this.removeDocumentClickListener();
  }

  private removeDocumentClickListener(): void {
    if (isPlatformBrowser(this.platformId) && this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
    }
  }

  totalSurveys = computed(() => this.filteredSurveys().length);

  private loadSurveys(): void {
    // ✅ changed here to decide API based on isOpenPage
    const apiCall = this.isOpenPage ? this.surveyService.getAll() : this.surveyService.getCompleted();

    apiCall.pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.data ?? [])),
      switchMap((surveys: SurveyOutDto[]) => forkJoin({
        surveys: of(surveys),
        types: this.templateTypeService.list(),
        templates: this.templateService.getAll()
      })),
      switchMap(({ surveys, templates, types }) => {
        const templateById = new Map(templates.map(t => [t.templateId, t]));
        const typeById = new Map(types.map(t=> [t.id, t]));
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
                typeLabel: templateById.get(s.templateId)?.typeName ?? 'Unknown',
                typecolor: typeById.get(templateById.get(s.templateId)!.typeId)?.color,
                sentTo: s.employeeIds.length,
                stats: { completed: 0, notTouched: s.employeeIds.length, inProgress: 0 }
              }))
            )
          )
        );
      })
    ).subscribe(cards => this.surveys.set(cards));
  }

  EditSurvey() {
    const id = this.activeCardMenu() ?? this.selectedCard()?.id;
    if (!id) return;
    this.activeCardMenu.set(null);
    this.selectedCard.set(null);
    this.router.navigate([`/lanch-survey/${id}/step1`]);
  }

  viewresponse (){
     const id = this.activeCardMenu() ?? this.selectedCard()?.id;
    if (!id) return;
    this.router.navigate([`surveys/seeanswer/${id}`]);

}
  onComplete(): void {
    if (!this.selectedCard() || !this.isOpenPage) return; // ✅ only complete if open survey
    const survey = this.selectedCard();
    this.surveyService.complete(survey.id).subscribe({
      next: _ => this.loadSurveys(),
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
        (survey.createdBy?.toLowerCase().includes(search)) ||
        (survey.typeLabel?.toLowerCase().includes(search));
      const matchesYear =
        !year || survey.createdOn.getFullYear().toString() === year;
      const matchesType =
        !type || survey.typeLabel.toLowerCase() === type.toLowerCase();

      return matchesSearch && matchesYear && matchesType;
    });
  });

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
      this.activeCardMenu.set(null);
      this.selectedCard.set(null);
      return;
    }
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.menuPosition.set({ x: rect.left - 100, y: rect.bottom + 5 });
    this.activeCardMenu.set(survey.id);
    this.selectedCard.set(survey);
  }

  getTypeColor(survey: any): string {
    return this.normalizeHex(survey ?? '#3B82F6');
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
  private documentClickListener?: (event: Event) => void;
  @HostListener('document:click')
  onDocClick(): void { this.closeMenu(); }

  /** Ferme avec la touche Échap */
  @HostListener('document:keydown.escape', ['$event'])
  onEsc(_: KeyboardEvent): void { this.closeMenu(); }

  /** Ferme si on scrolle ou on redimensionne */
  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowMove(): void { if (this.activeCardMenu()) this.closeMenu(); }
}
