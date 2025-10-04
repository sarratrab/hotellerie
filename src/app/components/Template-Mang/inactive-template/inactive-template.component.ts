import { Component, OnInit, OnDestroy, signal, computed, PLATFORM_ID, Inject, ViewChild, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { TemplateNavbarComponent } from '../template-navbar/template-navbar.component';
import { Router } from '@angular/router';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

import { ConfirmDialog } from 'primeng/confirmdialog';
import { SurveyNavbarComponent } from '../../Survey-Manag/survey-navbar/survey-navbar.component';
import { Toast } from 'primeng/toast';
import { TemplateBase } from '../../../models/interfaces/templateBase';
import { TemplateService } from '../../../services/template-services.service';
import { TypeServiceService } from '../../../services/type-service.service';
import { TemplateActionsService } from '../../../services/TemplateActionsService';
import { TemplateCard } from '../../../models/interfaces/template-read';
import { ActiveStatus } from '../../../models/interfaces/enums/ActiveStatus';
import { UsageStatus } from '../../../models/interfaces/enums/UsageStatus';


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
  
  private typeColorById = new Map<string, string>();
private typeLabelById = new Map<string, string>();

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
          this.templateTypeService.list().subscribe({
    next: (types: any[]) => {
      this.typeOptions = types.map(t => ({
        value: t.id,
        label: t.name,
        color: t.color
      }));

      this.typeColorById = new Map(types.map(t => [t.id, this.normalizeHex(t.color)]));
      this.typeLabelById = new Map(types.map(t => [t.id, t.name]));

    this.loadSurveysFromAPI();
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


