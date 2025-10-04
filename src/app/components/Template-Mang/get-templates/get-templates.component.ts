import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  PLATFORM_ID,
  Inject,
  ViewChild,
  HostListener
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { TemplateNavbarComponent } from '../template-navbar/template-navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DuplicateTemplateDialogComponent } from '../duplicate-template-dialog/duplicate-template-dialog.component';
import { SurveyNavbarComponent } from '../../Survey-Manag/survey-navbar/survey-navbar.component';
import { TemplateBase } from '../../../models/interfaces/templateBase';
import { TemplateCard } from '../../../models/interfaces/template-read';
import { TemplateService } from '../../../services/template-services.service';
import { TypeServiceService } from '../../../services/type-service.service';
import { TemplateActionsService } from '../../../services/TemplateActionsService';
import { AudienceStateService } from '../../../services/audience-state.service';
import { ActiveStatus } from '../../../models/interfaces/enums/ActiveStatus';
import { UsageStatus } from '../../../models/interfaces/enums/UsageStatus';

@Component({
  selector: 'app-get-templates',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SurveyNavbarComponent,
    TemplateNavbarComponent,
    TieredMenuModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './get-templates.component.html',
  styleUrl: './get-templates.component.css',
  providers: [MessageService]
})
export class GetTemplatesComponent implements OnInit, OnDestroy {

  @ViewChild('menu') menu!: TieredMenu;

  items: MenuItem[] = [];
  typeOptions: { value: string; label: string; color?: string }[] = [];
  ref: DynamicDialogRef | undefined;

  private typeColorById = new Map<string, string>();
  private typeLabelById = new Map<string, string>();

  searchTerm = signal<string>('');
  selectedYear = signal<string>('2025');
  selectedType = signal<string>('');
  surveys = signal<TemplateBase[]>([]);
  activeCardMenu = signal<string | null>(null);
  menuPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  selectedCard = signal<TemplateBase | null>(null);

  totalSurveys = computed(() => this.filteredSurveys().length);

  isActivePage = true; // default to active; can be set externally if needed

  private documentClickListener?: (event: Event) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
     private route: ActivatedRoute,
    private templateSvc: TemplateService,
    private templateTypeService: TypeServiceService,
      private msg: MessageService,
    private dialogService: DialogService,
    private templateActionsSvc: TemplateActionsService,
    private launchState: AudienceStateService,
    private audienceState: AudienceStateService,
  ) {}

ngOnInit(): void {
  this.items = [
    { label: 'Create a template', command: () => this.router.navigate(['/addtemp']) },
    { label: 'Export to Excel', command: () => console.log('') },
    { label: 'Export to PDF', command: () => console.log('') }
  ];

  // Get isActivePage from route data
  this.route.data.subscribe(data => {
    if (data['isActivePage'] !== undefined) {
      this.isActivePage = data['isActivePage'];
    }

    // Load types first
    this.templateTypeService.list().subscribe({
      next: (types: any[]) => {
        this.typeOptions = types.map(t => ({
          value: t.id,
          label: t.name,
          color: t.color
        }));

        this.typeColorById = new Map(types.map(t => [t.id, this.normalizeHex(t.color)]));
        this.typeLabelById = new Map(types.map(t => [t.id, t.name]));

        // Load surveys with correct status (active/inactive)
        this.loadSurveysFromAPI();
      },
      error: err => console.error('Error fetching types:', err)
    });
  });
}


  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.documentClickListener) {
      document.removeEventListener('click', this.documentClickListener);
    }
  }

  // ---------- filters ----------
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
  onSearch(): void {}
  onYearChange(): void {}
  onTypeChange(): void {}

  // ---------- card menu ----------
  toggleCardMenu(event: Event, survey: TemplateBase): void {
    event.stopPropagation();

    if (this.activeCardMenu() === survey.id) {
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

  editTemplate() {
    const id = this.activeCardMenu() ?? this.selectedCard()?.id;
    if (id) this.router.navigate(['/edit-template', id]);
    this.activeCardMenu.set(null);
  }

  duplicateTemplate(): void {
    const survey = this.selectedCard();
    const templateId = survey?.id;
    if (!templateId) return;

    const defaultName = survey ? `${survey.name} (Copy)` : '';

    this.ref = this.dialogService.open(DuplicateTemplateDialogComponent, {
      header: 'Duplicate Template',
      width: '400px',
      modal: true,
      data: {
        originalName: survey?.name || '',
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
    const id = this.activeCardMenu() ?? this.selectedCard()?.id ?? null;
    this.templateActionsSvc.confirmAndDelete(
      id,
      () => this.loadSurveysFromAPI(),
      () => this.activeCardMenu.set(null)
    );
  }

  previewTemplate(): void {
    const id = this.activeCardMenu() ?? this.selectedCard()?.id;
    this.activeCardMenu.set(null);
    if (id) this.router.navigate(['/templates', id]);
  }

  onAssign(t?: any) {
    const src = t ?? this.selectedCard();
    if (!src) return;

    const templateId = src?.templateId ?? src?.id ?? src?.template_id;
    const description = src?.description ?? src?.summary ?? '';

    if (!templateId) return;

    this.launchState.setTemplateInfo(templateId, description);

    this.activeCardMenu.set(null);
    this.selectedCard.set(null);
    this.audienceState.resetAudience();
    this.audienceState.resetAudienceexid();
    this.router.navigate(['/lanch-survey/step1']);
  }

  trackBySurvey(index: number, template: TemplateBase): string {
    return template.id;
  }

  // ---------- data ----------
 async loadSurveysFromAPI(): Promise<void> {
  const status = this.isActivePage ? 1 : 0; // 1 = active, 0 = inactive
  try {
    this.templateSvc.getAll({ status }).subscribe({
      next: list => {
        this.surveys.set(list.map(this.mapDtoToTemplateBase.bind(this)));
      },
      error: err => console.error('Error loading templates:', err)
    });
  } catch (error) {
    console.error('Error loading surveys:', error);
  }
}

  private performDuplication(templateId: string, newName: string): void {
    const originalTemplate = this.surveys().find(s => s.id === templateId);
    if (!originalTemplate) return;

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
          next: () => this.loadSurveysFromAPI(),
          error: err => console.error('Error duplicating template:', err)
        });
      },
      error: err => console.error('Error getting template details:', err)
    });
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

  private mapDtoToTemplateBase(dto: TemplateCard): TemplateBase {
    const color = this.typeColorById.get(dto.typeId) ?? '#3B82F6';
    const typeName = dto.typeName ?? this.typeLabelById.get(dto.typeId) ?? dto.typeId;

    return {
      id: dto.templateId,
      name: dto.name,
      description: dto.description ?? '',
      type: typeName,
      typeId: dto.typeId,
      typeColor: color,
      createdOn: new Date(dto.createdOn),
      createdBy: dto.createdByName || '—',
      usage_status: this.mapUsageStatus(dto.usageStatusId) as any,
      active_status: this.mapActiveStatus(dto.activeStatusId) as any
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

  // ---------- couleurs ----------
  getTypeColor(survey: any): string {
    return this.normalizeHex(survey?.typeColor ?? '#3B82F6');
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
    if (c.length === 4) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
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

  @HostListener('document:click')
  onDocClick(): void { this.closeMenu(); }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(_: KeyboardEvent): void { this.closeMenu(); }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowMove(): void { if (this.activeCardMenu()) this.closeMenu(); }
}
