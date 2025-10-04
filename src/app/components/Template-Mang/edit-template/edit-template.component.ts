import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

import { TemplateNavbarComponent } from "../template-header/template-navbar.component";

import { forkJoin } from 'rxjs';
import { FormDesignerComponent } from '../../Survey-Builder-tool/form-designer/form-designer.component';
import { SurveyNavbarComponent } from '../../Survey-Manag/survey-navbar/survey-navbar.component';
import { ActiveStatus } from '../../../models/interfaces/enums/ActiveStatus';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '../../../services/template-services.service';
import { FormService } from '../../../services/form.service';
import { TypeServiceService } from '../../../services/type-service.service';
import { FormRow } from '../../../models/form.model';
import { EditTemplateDto } from '../../../models/interfaces/EditTemplateDto';


@Component({
  selector: 'app-edit-template',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormDesignerComponent,
    SurveyNavbarComponent,
    ToastModule,
    CommonModule,
    TemplateNavbarComponent
  ],
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.css'],
  providers: [MessageService]
})
export class EditTemplateComponent implements OnInit {

  templateForm!: FormGroup;

  statusOptions = [
    { label: 'Active', value: ActiveStatus.Active },
    { label: 'Inactive', value: ActiveStatus.Inactive }
  ];

  typeOptions: { value: string; label: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService,
    private messageService: MessageService,
    private formService: FormService,
    private templateTypeService: TypeServiceService
  ) {}

  ngOnInit(): void {
    this.templateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      status: new FormControl(''),
      type: new FormControl('', Validators.required),
      description: new FormControl('')
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      forkJoin({
        types: this.templateTypeService.list(),
        template: this.templateService.getById(id)
      }).subscribe({
        next: ({ types, template }) => {
          console.log('Types:', types);
          console.log('Template:', template);

          this.typeOptions = types.map(t => ({
            value: t.id,   
            label: t.name
          }));
          console.log('Type Options:', this.typeOptions);

          this.templateForm.patchValue({
            name: template.name,
            status: template.activeStatusId,
            description: template.description,
            type: template.typeId
          });

          if (template.templateDefinition) {
            const rows: FormRow[] = JSON.parse(template.templateDefinition);
            this.formService.loadRows(rows);
          }
        },
        error: (err) => {
          console.error('Error in forkJoin:', err);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/active-templates']);
  }

  onSubmit() {
    if (this.templateForm.invalid) return;

    const dto: EditTemplateDto = {
      name: this.templateForm.value.name,
      typeId: this.templateForm.value.type,
      description: this.templateForm.value.description,
      activeStatus: Number(this.templateForm.value.status),
      templateDefinition: this.formService.exportTemplateDefinition(),
      templateId: this.route.snapshot.paramMap.get('id') || ''
    };

    this.templateService.editTemplate(dto).subscribe({
      next: res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Template updated successfully'
        });
        console.log('Template updated:', res.data);
      },
      error: err => {
        if (err.status === 400 && err.error?.message?.includes('linked surveys')) {
          this.messageService.add({
            severity: 'error',
            summary: 'Cannot update template',
            detail: 'This template has linked surveys and cannot be updated.'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update template'
          });
        }
        console.error('Error updating template:', err);
      }
    });
  }
}
