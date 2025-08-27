import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TemplateNavbarComponent } from '../template-navbar/template-navbar.component';
import { SurveyNavbarComponent } from '../survey-navbar/survey-navbar.component';
import { TypeServiceService } from '../../services/type-service.service';
import { TypeOutDto } from '../../models/interfaces/TypeOutDto';
import { ApiResponse } from '../../models/interfaces/template-read';
import { ToastModule } from "primeng/toast";


@Component({
  selector: 'app-edit-type',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, SurveyNavbarComponent, TemplateNavbarComponent, ToastModule, RouterLink],
  providers: [MessageService],
  templateUrl: './edit-type.component.html',
  styleUrl: './edit-type.component.css'
})
export class EditTypeComponent implements OnInit {
    private route = inject(ActivatedRoute);
  private router = inject(Router);
  private msg = inject(MessageService);
  private svc = inject(TypeServiceService);

  // mêmes propriétés que l’Add pour ne PAS toucher au HTML
    id = '';
  surveyTypeName = '';
  selectedColor = '#3b82f6';
  presetColors = ['#3b82f6','#22c55e','#f97316','#8b5cf6','#ef4444','#06b6d4','#111827','#EAB308'];
  usedCount = 0;
  // état
  // état UI
  loading = false;
  saving = false;
    // appelé par (click)="selectColor(color)"
  selectColor(color: string) {
    // normalise en #RRGGBB uppercase
    if (!color?.startsWith('#')) color = `#${color}`;
    this.selectedColor = color.toUpperCase();
  }

  // appelé par (change)="onColorChange($event)"
  onColorChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.selectColor(input.value || '#000000');
  }

  // validation simple
  public isHexValid(): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(this.selectedColor);
  }

  // id & données

  ngOnInit(): void {
    // récupère l'id depuis /edit-type/:id (adapté à ta route)
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.id) {
      this.msg.add({ severity: 'error', summary: 'Type', detail: 'Identifiant manquant.' });
      this.router.navigate(['/preferences']);
      return;
    }
    this.load();
  }

private load(): void {
  this.loading = true;
  this.svc.get(this.id).subscribe({
    next: (t: TypeOutDto) => {
      this.loading = false;
      if (!t) {
        this.msg.add({ severity: 'warn', summary: 'Type', detail: 'Introuvable' });
        this.router.navigate(['/preferences']);
        return;
      }

      this.surveyTypeName = t.name;
      this.selectedColor  = t.color;
      this.usedCount      = (t as any).templatesCount ?? 0;  // if you expose this
    },
    error: () => {
      this.loading = false;
      this.msg.add({ severity: 'error', summary: 'Type', detail: 'Chargement impossible.' });
      this.router.navigate(['/preferences']);
    }
  });
}

  // même validation que sur l’ajout
 public  isHexValidd(c?: string) {
    return !!c && /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(c);
  }

  submit(): void {
    const name = this.surveyTypeName.trim();
    const color = this.selectedColor.trim();

    if (!name || !this.isHexValidd(color) || this.saving) return;

    // Bloquer l’édition si déjà utilisé par des templates
    if (this.usedCount > 0) {
      this.msg.add({
        severity: 'warn',
        summary: 'Impossible',
        detail: `Ce type est utilisé par ${this.usedCount} template(s).`,
      });
      return;
    }

    this.saving = true;
    this.svc.update(this.id, { name, color }).subscribe({
      next: (res: ApiResponse<TypeOutDto>) => {
        this.saving = false;

        if (res.success) {
          this.msg.add({ severity: 'success', summary: 'Modifié', detail: 'Type mis à jour.' });
          this.router.navigate(['/preferences']);
        } else {
          const sev = res.status === 409 ? 'warn' : 'error';
          this.msg.add({ severity: sev, summary: 'Update', detail: res.message || 'Mise à jour refusée.' });
        }
      },
      error: (err) => {
        this.saving = false;
        const detail =
          err?.status === 409
            ? err?.error?.message ?? 'Ce type est utilisé par des templates (ou nom déjà existant).'
            : err?.status === 404
            ? 'Type introuvable.'
            : 'Échec de la mise à jour.';
        this.msg.add({ severity: err?.status === 409 ? 'warn' : 'error', summary: 'Update', detail });
      },
    });
  }
}