import { ActiveStatus } from './enums/ActiveStatus';

export interface EditTemplateDto {
  templateId: string;           
  name?: string;
  typeId?: string;
  description?: string;
  templateDefinition?: string;
  activeStatus?: ActiveStatus;
}
