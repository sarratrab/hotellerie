import { 
  Component, 
  OnInit, 
  AfterViewInit, 
  ViewChild, 
  ElementRef, 
  Inject, 
  PLATFORM_ID, 
  inject, 
  signal 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import QuillType from 'quill';

import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TemplateNavbarComponent } from '../../Template-Mang/template-navbar/template-navbar.component';
import { SurveyNavbarComponent } from '../../Survey-Manag/survey-navbar/survey-navbar.component';
import { TypeServiceService } from '../../../services/type-service.service';
import { TypeOutDto } from '../../../models/interfaces/TypeOutDto';

@Component({
  selector: 'app-preferences',
  imports: [
  CommonModule,
  FormsModule,
  TemplateNavbarComponent,
  SurveyNavbarComponent,
  RouterLink,
  ToastModule,
  ConfirmDialogModule,
  DialogModule
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent implements OnInit, AfterViewInit {
  @ViewChild('editor1', { static: false }) editor1Ref!: ElementRef;
  @ViewChild('editor2', { static: false }) editor2Ref!: ElementRef;

  isEditing = false;
  isBrowser: boolean;
  private quill1!: QuillType;
  private quill2!: QuillType;

  surveyInvitation = `Subject: New Survey: {{survey_title}}<br>Hi {{employee_name}},`;
  reminderEmail = `Subject: Reminder: {{survey_title}} - Due {{due_date}}<br>Hi {{employee_name}},`;

  private tempSurveyInvitation = '';
  private tempReminderEmail = '';

  surveyTypes = signal([
    { id: 'employee-feedback', name: 'Employee Feedback', color: '#3182ce', usage: 12 },
    { id: 'performance-review', name: 'Performance Review', color: '#38a169', usage: 8 },
    { id: 'training-evaluation', name: 'Training Evaluation', color: '#ed8936', usage: 5 },
    { id: 'customer-service', name: 'Customer Service', color: '#805ad5', usage: 3 }
  ]);

  private typeSvc = inject(TypeServiceService);

  types = signal<TypeOutDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  expandedTemplate: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object, private router: Router, private msg: MessageService, private confirm: ConfirmationService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.fetchTypes();
  }

  ngAfterViewInit() {
    if (this.isBrowser && this.isEditing) {
      this.initQuillEditors();
    }
  }

  fetchTypes(q?: string) {
    this.loading.set(true);
    this.error.set(null);
    this.typeSvc.list(q).subscribe({
      next: list => { this.types.set(list); this.loading.set(false); },
      error: err => { console.error(err); this.error.set('Failed to load survey types'); this.loading.set(false); }
    });
  }

  trackById = (_: number, t: TypeOutDto) => t.id;

  handleEditType(surveyType: any, event: Event) {
    event.stopPropagation();
    const newName = prompt('Edit survey type name:', surveyType.name);
    if (newName && newName.trim() !== surveyType.name) {
      this.updateTypeName(surveyType.id, newName.trim());
    }
  }

  handleTypeClick(surveyType: any) {
    this.router.navigate(['/surveys', surveyType.id]);
  }

  addNewType(name: string) {
    const colors = ['#3182ce', '#38a169', '#ed8936', '#805ad5', '#e53e3e', '#d69e2e'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newType = { id: name.toLowerCase().replace(/\s+/g, '-'), name, color: randomColor, usage: 0 };
    this.surveyTypes.update(types => [...types, newType]);
  }

  updateTypeName(typeId: string, newName: string) {
    this.surveyTypes.update(types => types.map(t => t.id === typeId ? { ...t, name: newName } : t));
  }

  onEdit() { console.log('Edit templates clicked'); }

  toggleTemplate(templateType: string) { this.expandedTemplate = this.expandedTemplate === templateType ? null : templateType; }

  isTemplateExpanded(templateType: string): boolean { return this.expandedTemplate === templateType; }

  edit() {
    this.tempSurveyInvitation = this.surveyInvitation;
    this.tempReminderEmail = this.reminderEmail;
    this.isEditing = true;
    if (this.isBrowser) { setTimeout(() => this.initQuillEditors(), 0); }
  }

  private async initQuillEditors() {
    const QuillModule = await import('quill');
    const Quill = QuillModule.default;
    if (this.editor1Ref) { this.quill1 = new Quill(this.editor1Ref.nativeElement, { theme: 'snow', modules: { toolbar: true } }); this.quill1.root.innerHTML = this.surveyInvitation; }
    if (this.editor2Ref) { this.quill2 = new Quill(this.editor2Ref.nativeElement, { theme: 'snow', modules: { toolbar: true } }); this.quill2.root.innerHTML = this.reminderEmail; }
  }

  save() {
    if (this.isBrowser && this.quill1 && this.quill2) {
      this.surveyInvitation = this.quill1.root.innerHTML;
      this.reminderEmail = this.quill2.root.innerHTML;
    }
    this.isEditing = false;
  }

  cancel() {
    this.surveyInvitation = this.tempSurveyInvitation;
    this.reminderEmail = this.tempReminderEmail;
    this.isEditing = false;
  }

  onDelete(t: TypeOutDto) {
    const id = (t as any).id ?? (t as any).Id;
    const name = t.name;
    if (!id) { this.msg.add({ severity: 'error', summary: 'Missing id', detail: 'Type id is undefined.' }); return; }
    this.confirm.confirm({ message: `Delete the type "${name}"?`, header: 'Confirm', icon: 'pi pi-exclamation-triangle', accept: () => this.reallyDelete(id) });
  }

  private reallyDelete(id: string) {
    this.typeSvc.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.types.set(this.types().filter(x => (x as any).id !== id && (x as any).Id !== id && (x as any).typeId !== id));
          this.msg.add({ severity: 'success', summary: 'Deleted', detail: 'Type deleted.' });
        } else { this.msg.add({ severity: 'warn', summary: 'Cannot delete', detail: res.message || '' }); }
      },
      error: (err) => {
        const detail = err?.status === 409 ? (err?.error?.message || 'Type is used by existing templates.') : (err?.error?.message || 'Failed to delete type.');
        this.msg.add({ severity: 'warn', summary: 'Cannot delete', detail });
      }
    });
  }

  onEditType(t: any) { const id = t.id ?? t.Id ?? t.typeId; this.router.navigate(['/edittype', id]); }
}
