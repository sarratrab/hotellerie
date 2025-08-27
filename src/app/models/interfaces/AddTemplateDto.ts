import { ActiveStatus } from './enums/ActiveStatus';
import { UsageStatus } from './enums/UsageStatus';

export interface AddTemplateDto {
  Name: string;
  TypeId: string;
  ActiveStatus: ActiveStatus;
  Description: string;
  TemplateDefinition: string;
  UsageStatus ?: UsageStatus| null;
  CreatedBy : string;
}