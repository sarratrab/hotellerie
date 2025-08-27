import { ConfirmationService, MessageService } from "primeng/api";
import { TemplateService } from "./template-services.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TemplateActionsService {
    
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private templateSvc: TemplateService,   
  ) {}

  confirmAndDelete(id: string | null, onSuccess: () => void, onReset: () => void) {
    if (!id) {
      console.error("No template selected for deletion");
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this template?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.templateSvc.deleteTemplate(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Template deleted successfully'
              });
              onSuccess();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Failed',
                detail: response.message
              });
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'This template has linked surveys and cannot be deleted'
            });
            console.error("Error deleting template:", err);
          }
        });
        onReset();
      },
      reject: () => onReset()
    });
  }
}
