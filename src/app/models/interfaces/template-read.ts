
export interface TemplateCard {
  templateId: string;
  name: string;
  description?: string | null;

  typeId: string;
  typeName?: string | null;

  activeStatusId: number;      
  usageStatusId?: number | null;

  createdOn: string;           
  createdByName?: string | null;
  createdById?: string | null;
}

export interface TemplateDetail extends TemplateCard {
  templateDefinition: string;  
}
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}
