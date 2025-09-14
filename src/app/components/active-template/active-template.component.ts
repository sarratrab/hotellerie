import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  PLATFORM_ID,
  Inject,
  ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SurveyNavbarComponent } from '../survey-navbar/survey-navbar.component';
import { TemplateNavbarComponent } from '../template-navbar/template-navbar.component';
import { Router } from '@angular/router';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem, MessageService } from 'primeng/api';
import { TemplateBase } from '../../models/interfaces/templateBase';
import { UsageStatus } from '../../models/interfaces/enums/UsageStatus';
import { ActiveStatus } from '../../models/interfaces/enums/ActiveStatus';
import { TemplateService } from '../../services/template-services.service';
import { TemplateCard } from '../../models/interfaces/template-read';
import { TypeServiceService } from '../../services/type-service.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DuplicateTemplateDialogComponent } from '../duplicate-template-dialog/duplicate-template-dialog.component';
import { TemplateActionsService } from '../../services/TemplateActionsService';
// at the top
import { MultiSelectModule } from 'primeng/multiselect';
import { LaunchSurveyStateService } from '../../services/launch-survey-state.service';
import { AudienceStateService } from '../../services/audience-state.service';


@Component({
  selector: 'app-active-template',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SurveyNavbarComponent,
    TemplateNavbarComponent,
    TieredMenuModule,
    ToastModule,
    ConfirmDialogModule,
    MultiSelectModule,
  ],
  templateUrl: './active-template.component.html',
  styleUrl: './active-template.component.css'
})
export class ActiveTemplateComponent implements OnInit, OnDestroy {

  @ViewChild('menu') menu!: TieredMenu;

  items: MenuItem[] = [];
  typeOptions: { value: string; label: string }[] = [];
  ref: DynamicDialogRef | undefined;
  private typeColorById = new Map<string, string>();
private typeLabelById = new Map<string, string>();

  searchTerm = signal<string>('');
  selectedYear = signal<string>('2025');
  selectedType = signal<string>('');
  surveys = signal<TemplateBase[]>([]);
  activeCardMenu = signal<string | null>(null);
  menuPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  totalSurveys = computed(() => this.filteredSurveys().length);

  private documentClickListener?: (event: Event) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private templateSvc: TemplateService,
    private templateTypeService: TypeServiceService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private templateActionsSvc: TemplateActionsService,
    private launchState: AudienceStateService,
  ) {}

  ngOnInit(): void {
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
      error: err => {
        console.error('Error fetching types:', err);
      }
    });
    this.loadSurveysFromAPI();
  }

  ngOnDestroy(): void {
    this.removeDocumentClickListener();
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

  editTemplate() {
    const id = this.activeCardMenu();
    this.router.navigate(['/edit-template', id]);
  }

  duplicateTemplate(): void {
    const templateId = this.activeCardMenu();
    if (!templateId) {
      console.error('No template selected for duplication');
      return;
    }

    const currentTemplate = this.surveys().find(s => s.id === templateId);
    const defaultName = currentTemplate ? `${currentTemplate.name} (Copy)` : '';

    this.ref = this.dialogService.open(DuplicateTemplateDialogComponent, {
      header: 'Duplicate Template',
      width: '400px',
      modal: true,
      data: {
        originalName: currentTemplate?.name || '',
        defaultName: defaultName
      }
    });

    this.ref.onClose.subscribe((newName: string) => {
      if (newName) {
        this.performDuplication(templateId, newName);
      }
      this.activeCardMenu.set(null);
    });
  }

  deleteTemplate(): void {
    this.templateActionsSvc.confirmAndDelete(
      this.activeCardMenu(),
      () => this.loadSurveysFromAPI(),
      () => this.activeCardMenu.set(null)
    );
  }

  previewTemplate(): void {
    const id = this.activeCardMenu();
    this.activeCardMenu.set(null);
    if (id) this.router.navigate(['/templates', id]);
  }

  onAssign(t: any) {
    const templateId = t?.templateId ?? t?.id ?? t?.template_id;
    const name       = t?.name ?? t?.title ?? '';
    const description = t?.description ?? t?.summary ?? '';

    if (!templateId) {
      console.error('TemplateId manquant sur la carte:', t);
      return;
    }

    this.launchState.setTemplateInfo(templateId, name, description);
    this.router.navigate(['/lanch-survey/step1']);
  }


  trackBySurvey(index: number, template: TemplateBase): string {
    return template.id;
  }

  private removeDocumentClickListener(): void {
    if (isPlatformBrowser(this.platformId) && this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
    }
  }

  async loadSurveysFromAPI(): Promise<void> {
    try {
      this.templateSvc.getAll({ status: 1 /* Active */ }).subscribe({
        next: list => {
          const mapped = list.map(this.mapDtoToTemplateBase.bind(this));
          this.surveys.set(mapped);
        },
        error: err => console.error('Error loading templates:', err)
      });
    } catch (error) {
      console.error('Error loading surveys:', error);
    }
  }

  private performDuplication(templateId: string, newName: string): void {
    const originalTemplate = this.surveys().find(s => s.id === templateId);
    if (!originalTemplate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Original template not found'
      });
      return;
    }

    this.templateSvc.getById(templateId).subscribe({
      next: templateDetails => {
        const newTemplate = {
          Name: newName,
          TypeId: templateDetails.typeId,
          ActiveStatus: ActiveStatus.Active,
          Description: templateDetails.description || '',
          TemplateDefinition: templateDetails.templateDefinition || '',
          UsageStatus: UsageStatus.Idle,
          CreatedBy: templateDetails.createdById || '644817fe-1333-4bb9-ab8d-757218f54ef7'
        };

        this.templateSvc.add(newTemplate).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Template duplicated successfully'
            });
            this.loadSurveysFromAPI();
          },
          error: err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred while duplicating the template'
            });
            console.error('Error duplicating template:', err);
          }
        });
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not retrieve template details for duplication'
        });
        console.error('Error getting template details:', err);
      }
    });
  }

private mapDtoToTemplateBase(dto: TemplateCard): TemplateBase {
  const color = this.typeColorById.get(dto.typeId) ?? '#3B82F6';
  const typeName = dto.typeName ?? this.typeLabelById.get(dto.typeId) ?? dto.typeId;

  return {
    id: dto.templateId,
    name: dto.name,
    description: dto.description ?? '',
    type: typeName,
    typeId: dto.typeId,        // <— utile si besoin plus tard
    typeColor: color,          // <— injecté ici
    createdOn: new Date(dto.createdOn),
    createdBy: dto.createdByName || '—',
    usage_status: this.mapUsageStatus(dto.usageStatusId) as any,
    active_status: this.mapActiveStatus(dto.activeStatusId) as any
  };
}


  private mapActiveStatus(v: number | string | null | undefined) {
    if (typeof v === 'string') {
      const s = v.toLowerCase();
      return s.includes('active') && !s.includes('not')
        ? ActiveStatus.Active
        : ActiveStatus.Inactive;
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

  // Couleur prioritaire : card.typeColor -> card.type?.color -> card.color -> défaut
getTypeColor(survey: any): string {
  return this.normalizeHex(survey?.typeColor ?? '#3B82F6');
}

typeChipStyle(survey: any) {
  const hex = this.getTypeColor(survey);
  return {
    'background-color': this.tint(hex, 0.85),
    'color': hex,
    'border-color': this.tint(hex, 0.7)
  };
}


/* -------- helpers couleur -------- */
private normalizeHex(c: string): string {
  if (!c) return '#3B82F6';
  c = ('' + c).trim();
  if (!c.startsWith('#')) c = '#' + c;
  if (c.length === 4) {
    // #abc -> #aabbcc
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

// mélange vers blanc (ratio 0..1)
private tint(hex: string, ratio = 0.85): string {
  const { r, g, b } = this.hexToRgb(hex);
  const nr = Math.round(r + (255 - r) * ratio);
  const ng = Math.round(g + (255 - g) * ratio);
  const nb = Math.round(b + (255 - b) * ratio);
  return `rgb(${nr}, ${ng}, ${nb})`;
}

}
