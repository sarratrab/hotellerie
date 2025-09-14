export interface AudienceSelection {
  allEmployees: boolean;
  departmentIds: number[];   // ids Department
  positionIds: number[];     // ids Position
  cities: string[];     // true par défaut (match ANY)
}
