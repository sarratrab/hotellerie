import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { EmployeeSurveyItemDto, ResponseService } from '../../../services/response.service';
import { RouterModule } from '@angular/router';
import { TemplateService } from '../../../services/template-services.service';
import { TypeServiceService } from '../../../services/type-service.service';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

type Status = 'PENDING' | 'IN PROGRESS';

interface SurveyCard {
  title: string;
  description: string;
  minutes: number;
  // Active
  due?: Date;
  progress?: number;          // 0..100 (active)
  status?: Status;            // active status
  // Completed
  completedOn?: Date;
  tag?: 'TRAINING' | 'PERFORMANCE' | undefined;
}
@Component({
  selector: 'app-survey-employee',
  imports: [NavbarComponent,CommonModule, RouterModule],
  templateUrl: './survey-employee.component.html',
  styleUrl: './survey-employee.component.css'
})
export class SurveyEmployeeComponent {

    private typeColorById = new Map<string,string>();
  private typeLabelById = new Map<string,string>();
  private templateTypeIdByTplId = new Map<string,string>();
totalSurveys() {
throw new Error('Method not implemented.');
}
progress(s: EmployeeSurveyItemDto): number {
  const v = typeof s.progressPercent === 'string'
    ? parseFloat(s.progressPercent)
    : (s.progressPercent ?? 0);
  // borne + arrondi propre
  return Math.min(100, Math.max(0, Math.round(v)));
}

uiText(s: EmployeeSurveyItemDto): 'Pending' | 'In Progress' | 'Completed' {
  const code = typeof s.uiStatus === 'string' ? parseInt(s.uiStatus, 10) : s.uiStatus;
  return code === 2 ? 'Completed' : code === 1 ? 'In Progress' : 'Pending';
}

// Retourne la classe du chip
chipClass(s: EmployeeSurveyItemDto): string {
  const code = typeof s.uiStatus === 'string' ? parseInt(s.uiStatus, 10) : s.uiStatus;
  return code === 2 ? 'completed' : code === 1 ? 'inprogress' : 'pending';
}

  uiChip(s: EmployeeSurveyItemDto): 'Pending'|'InProgress'|'Completed' {
    // 0=Pending,1=InProgress,2=Completed
    return s.uiStatus === 2 ? 'Completed' : s.uiStatus === 1 ? 'InProgress' : 'Pending';
  }

  ctaLabel(s: EmployeeSurveyItemDto): string {
    const chip = this.uiChip(s);
    return chip === 'Completed' ? 'View' : chip === 'InProgress' ? 'Continue' : 'Start';
  }

  // pour l'URL answer (tu l’as déjà)
  answerLink(s: EmployeeSurveyItemDto): any[] {
    return ['/surveys', s.surveyId, 'answer'];
  }
  openFeedback(item: EmployeeSurveyItemDto) {
    // TODO: ouvrir un dialog, naviguer, etc.
    console.log('Open feedback for', item.surveyId);
  }
employeeId = 4; // provisoire
active: EmployeeSurveyItemDto[] = [];
completed: EmployeeSurveyItemDto[] = [];
error?: string;
constructor(private api : ResponseService,
    private tplSvc: TemplateService,
    private typeSvc: TypeServiceService){}

  ngOnInit(): void {
    forkJoin({
      data: this.api.getForEmployee(this.employeeId),        // { active, completed }
      templates: this.tplSvc.getAll(),                        // [{ templateId, typeId, typeName, ... }]
      types: this.typeSvc.list()                              // [{ id, name, color }]
    })
    .pipe(
      map(({ data, templates, types }) => {
        // maps
        this.templateTypeIdByTplId = new Map(templates.map((t: any) => [t.templateId, t.typeId]));
        this.typeLabelById = new Map(types.map((t: any) => [t.id, t.name]));
        this.typeColorById = new Map(types.map((t: any) => [t.id, this.normalizeHex(t.color)]));

        // enrich function
        const enrich = (arr: EmployeeSurveyItemDto[]) =>
          (arr ?? []).map(it => {
            const typeId = this.templateTypeIdByTplId.get(it.templateId!);
            return {
              ...it,
              typeLabel: typeId ? (this.typeLabelById.get(typeId) ?? 'Unknown') : 'Unknown',
              typeColor: typeId ? (this.typeColorById.get(typeId) ?? '#3B82F6') : '#3B82F6'
            };
          });

        return {
          active: enrich(data.active),
          completed: enrich(data.completed)
        };
      })
    )
    .subscribe({
      next: ({ active, completed }) => { this.active = active; this.completed = completed; },
      error: _ => { this.error = 'Erreur de chargement.';  }
    });
  }

  // === helpers couleur (reprend ceux de GetSurveys) ===
  private normalizeHex(c: string): string {
    if (!c) return '#3B82F6';
    c = (''+c).trim();
    if (!c.startsWith('#')) c = '#'+c;
    if (c.length === 4) c = '#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];
    return c.toUpperCase();
  }

  private hexToRgb(hex: string) {
    const h = this.normalizeHex(hex).slice(1);
    return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
  }

  private tint(hex: string, ratio = 0.85): string {
    const { r,g,b } = this.hexToRgb(hex);
    const nr = Math.round(r + (255 - r) * ratio);
    const ng = Math.round(g + (255 - g) * ratio);
    const nb = Math.round(b + (255 - b) * ratio);
    return `rgb(${nr}, ${ng}, ${nb})`;
  }

  typeChipStyle(item: EmployeeSurveyItemDto) {
    const hex = item.typeColor ?? '#3B82F6';
    return { 'background-color': this.tint(hex, 0.85), color: hex, 'border-color': this.tint(hex, 0.7) };
  }

statusClass(status: 'Pending' | 'InProgress' | 'Completed'): string {
  switch (status) {
    case 'Completed': return 'completed';
    case 'InProgress': return 'inprogress';
    default: return 'pending';
  }
}

   activeSurveys: SurveyCard[] = [
    {
      title: 'Q1 2025 Employee Satisfaction',
      description: 'Help us understand your experience and satisfaction with your current role and work environment.',
      due: new Date(2025, 0, 30),
      minutes: 5,
      status: 'PENDING'
    },
    {
      title: 'Team Collaboration Assessment',
      description: 'Share your thoughts on team dynamics and collaboration within your department.',
      due: new Date(2025, 1, 5),
      minutes: 8,
      status: 'PENDING'
    },
    {
      title: 'Workplace Culture Evaluation',
      description: 'Assess our company culture and suggest improvements for a better work environment.',
      due: new Date(2025, 0, 28),
      minutes: 10,
      progress: 65,
      status: 'IN PROGRESS'
    }
  ];

  completedSurveys: SurveyCard[] = [
    {
      title: 'Year-End Review Survey',
      description: 'Annual review of company policies, benefits, and overall employee experience.',
      completedOn: new Date(2024, 11, 15),
      minutes: 12
    },
    {
      title: 'Remote Work Effectiveness',
      description: 'Evaluation of remote work policies and tools effectiveness during Q4 2024.',
      completedOn: new Date(2024, 10, 22),
      minutes: 7,
      tag: 'TRAINING'
    }
  ];


}

