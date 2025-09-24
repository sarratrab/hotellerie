export interface EmployeeRow {
  id: number;
  name: string;
  title?: string;
  department?: string;
  manager?: string;
  city?: string;
  isSelected: boolean;
  location?: string;
  position?: string;
}