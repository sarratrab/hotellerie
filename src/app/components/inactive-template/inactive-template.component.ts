import { Component, OnInit, OnDestroy, signal, computed, PLATFORM_ID, Inject, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SurveyNavbarComponent } from '../survey-navbar/survey-navbar.component';
import { TemplateNavbarComponent } from '../template-navbar/template-navbar.component';
import { Router } from '@angular/router';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TemplateService } from '../../services/template-services.service';
import { TemplateBase } from '../../models/interfaces/templateBase';
import { ActiveStatus } from '../../models/interfaces/enums/ActiveStatus';
import { UsageStatus } from '../../models/interfaces/enums/UsageStatus';
import { TypeServiceService } from '../../services/type-service.service';
import { TemplateCard } from '../../models/interfaces/template-read';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TemplateActionsService } from '../../services/TemplateActionsService';

@Component({
  selector: 'app-inactive-template',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SurveyNavbarComponent,
    TemplateNavbarComponent,
    TieredMenuModule,
    Toast,
    ConfirmDialog,
  ],
  templateUrl: './inactive-template.component.html',
  styleUrl: './inactive-template.component.css',
  providers: [MessageService, ConfirmationService]
})
export class InactiveTemplateComponent implements OnInit, OnDestroy {
  @ViewChild('menu') menu!: TieredMenu;

  items: MenuItem[] = [];
  typeOptions: { value: string; label: string }[] = [];

  searchTerm = signal<string>('');
  selectedYear = signal<string>('2025');
  selectedType = signal<string>('');
  surveys = signal<TemplateBase[]>([]);
  activeCardMenu = signal<string | null>(null);
  menuPosition = signal<{ x: number, y: number }>({ x: 0, y: 0 });

  private documentClickListener?: (event: Event) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private templateSvc: TemplateService,
    private templateTypeService: TypeServiceService,
    private msg: MessageService,
    private templateActionsSvc: TemplateActionsService,
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: 'Create a template', command: () => this.router.navigate(['/addtemp']) },
      { label: 'Export to Excel', command: () => console.log('') },
      { label: 'Export to PDF', command: () => console.log('') }
    ];

    this.loadSurveysFromAPI();

    this.templateTypeService.list().subscribe({
      next: (types) => {
        this.typeOptions = types.map(t => ({ value: t.id, label: t.name }));
      },
      error: (err) => console.error('Error fetching types:', err)
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
    }
  }

  toggleMenu(event: Event) {
    this.menu.toggle(event);
  }

  filteredSurveys = computed(() => {
    const surveys = this.surveys();
    const search = this.searchTerm().toLowerCase();
    const year = this.selectedYear();
    const type = this.selectedType();

    return surveys.filter(survey => {
      const matchesSearch = !search ||
        survey.name.toLowerCase().includes(search) ||
        survey.createdBy.toLowerCase().includes(search) ||
        survey.type.toLowerCase().includes(search) ||
        (survey.usage_status && survey.usage_status);

      const matchesYear = !year || survey.createdOn.getFullYear().toString() === year;
      const matchesType = !type || survey.type.toLowerCase() === type.toLowerCase();

      return matchesSearch && matchesYear && matchesType;
    });
  });

  totalSurveys = computed(() => this.filteredSurveys().length);

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
      this.menuPosition.set({ x: rect.left - 100, y: rect.bottom + 5 });
      this.activeCardMenu.set(surveyId);
    }
  }

  deleteTemplate(): void {
    this.templateActionsSvc.confirmAndDelete(
      this.activeCardMenu(),
      () => this.loadSurveysFromAPI(),
      () => this.activeCardMenu.set(null)
    );
  }

  deleteSurvey(): void {
    const activeCard = this.activeCardMenu();
    if (activeCard && confirm('Are you sure you want to delete this survey?')) {
      this.surveys.set(this.surveys().filter(survey => survey.id !== activeCard));
    }
    this.activeCardMenu.set(null);
  }

  trackBySurvey(index: number, template: TemplateBase): string {
    return template.id;
  }

  async loadSurveysFromAPI(): Promise<void> {
    try {
      this.templateSvc.getAll({ status: 0 }).subscribe({
        next: (list) => {
          this.surveys.set(list.map(this.mapDtoToTemplateBase.bind(this)));
        },
        error: (err) => console.error('Error loading templates:', err)
      });
    } catch (error) {
      console.error('Error loading surveys:', error);
    }
  }

  private mapDtoToTemplateBase(dto: TemplateCard): TemplateBase {
    return {
      id: dto.templateId,
      name: dto.name,
      description: dto.description ?? '',
      type: dto.typeName || dto.typeId,
      createdOn: new Date(dto.createdOn),
      createdBy: dto.createdByName || '—',
      usage_status: this.mapUsageStatus(dto.usageStatusId) as any,
      active_status: this.mapActiveStatus(dto.activeStatusId) as any,
    };
  }

  private mapActiveStatus(v: number | string | null | undefined) {
    if (typeof v === 'string') {
      const s = v.toLowerCase();
      return s.includes('active') && !s.includes('not') ? ActiveStatus.Active : ActiveStatus.Inactive;
    }
    return v === 1 ? ActiveStatus.Active : ActiveStatus.Inactive;
  }

  private mapUsageStatus(v: number | string | null | undefined) {
    if (typeof v === 'string') {
      const s = v.toLowerCase();
      if (s.includes('in') && s.includes('use')) return UsageStatus.Inuse;
      if (s.includes('idle')) return UsageStatus.Idle;
    }
    return v === 1 ? UsageStatus.Inuse : UsageStatus.Idle;
  }

  preview(): void {
    const id = this.activeCardMenu();
    this.activeCardMenu.set(null);
    if (id) this.router.navigate(['/templates', id]);
  }

  setActive(active: boolean) {
    const id = this.activeCardMenu();
    this.activeCardMenu.set(null);
    if (!id) return;

    this.templateSvc.editTemplate({
      templateId: id,
      activeStatus: active ? ActiveStatus.Active : ActiveStatus.Inactive
    }).subscribe({
      next: () => {
        if ((this as any).templates?.update) {
          (this as any).templates.update((list: any[]) =>
            list.map(x =>
              (x.templateId ?? x.id) === id
                ? { ...x, activeStatusId: active ? ActiveStatus.Active : ActiveStatus.Inactive, usageStatusId: active ? (x.usageStatusId ?? 1) : null }
                : x
            )
          );
        }

        this.msg.add({ severity: 'success', summary: active ? 'Activé' : 'Désactivé', detail: 'Statut du template mis à jour.', life: 2200 });
        setTimeout(() => this.router.navigate(['/active-templates']), 2200);
      },
      error: (err) => {
        this.msg.add({ severity: 'error', summary: 'Échec', detail: err?.error?.message || 'Impossible de mettre à jour le statut.' });
      }
    });
  }
}
