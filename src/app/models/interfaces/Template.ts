import { ActiveStatus } from "./enums/ActiveStatus";
import { UsageStatus } from "./enums/UsageStatus";

export interface Template {
  templateId: string;
  name: string;
  typeId: string;
  activeStatus: ActiveStatus;
  description: string;
  createdBy: string;
  createdOn: string;   
  templateDefinition: string;
  usageStatus: UsageStatus;
}
