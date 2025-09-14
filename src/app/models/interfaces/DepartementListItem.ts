export interface DepartmentListItem {
  departmentId: number;
  name: string;
  description?: string;
  code?: string;
  isActive?: boolean;
  order?: number;
  employeesCount?: number;
}