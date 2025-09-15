import { Component } from '@angular/core';
import { FormDesignerComponent } from "../form-designer/form-designer.component";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SurveyNavbarComponent } from '../survey-navbar/survey-navbar.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormService } from '../../services/form.service';
import { ActiveStatus } from '../../models/interfaces/enums/ActiveStatus';
import { TemplateService } from '../../services/template-services.service';
import { HttpClientModule } from '@angular/common/http';
import { AddTemplateDto } from '../../models/interfaces/AddTemplateDto';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TemplateNavbarComponent } from "../template-header/template-navbar.component";
import { TypeServiceService } from '../../services/type-service.service';

@Component({
  selector: 'app-add-template',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule,
    DropdownModule,
    ToastModule,
    FormDesignerComponent,
    SurveyNavbarComponent,
    TemplateNavbarComponent
  ],
  templateUrl: './add-template.component.html',
  styleUrl: './add-template.component.css'
})
export class AddTemplateComponent {
  
  templateForm!: FormGroup;

  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Not Active', value: 'inactive' }
  ];

  typeOptions: { value: string; label: string }[] = [];

  constructor(
    private templateService: TemplateService,
    private formService: FormService,
    private messageService: MessageService,
    private router: Router,
    private templateTypeService: TypeServiceService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.templateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      status: new FormControl('active'),
      type: new FormControl('', Validators.required),
      description: new FormControl('')
    });

    this.formService.resetRows();

    this.templateTypeService.list().subscribe({
      next: types => {
        console.log('Types:', types);
        this.typeOptions = types.map(t => ({
          value: t.id,
          label: t.name
        }));
      },
      error: err => {
        console.error('Error fetching types:', err);
      }
    });
  }

  onCancel() {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigate(['/active-templates']);
  }

  onSubmit() {
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    }

    const formValues = this.templateForm.value;
    const active_Status =
      formValues.status === 'active' ? ActiveStatus.Active : ActiveStatus.Inactive;
    const Usage_Status = formValues.status === 'active' ? 0 : null;

    const template: AddTemplateDto = {
      Name: formValues.name,
      TypeId: formValues.type,
      ActiveStatus: active_Status,
      Description: formValues.description,
      TemplateDefinition: this.formService.exportTemplateDefinition(),
      UsageStatus: Usage_Status,
      CreatedBy: '2' // to do later
    };

    this.templateService.add(template).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Template saved successfully!'
        });

        this.templateForm.reset();
        this.formService.resetRows();

        if (window.history.length > 1) {
          this.location.back();
          return;
        }

        this.router.navigate(['/active-templates']);
      },
      error: err => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save template.'
        });
      }
    });
  }
}
