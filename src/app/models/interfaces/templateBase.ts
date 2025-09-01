import { ActiveStatus } from "./enums/ActiveStatus";
import { UsageStatus } from "./enums/UsageStatus";

export interface TemplateBase {
  id: string;
  name: string;
  description: string;
  type : string;
  typeId?: string,       
  typeColor?: string,   
  createdOn: Date;
  createdBy: string;
  usage_status: UsageStatus
  active_status: ActiveStatus;
  
}
