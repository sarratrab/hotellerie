import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DepartmentListItem } from '../models/interfaces/DepartementListItem';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/interfaces/ApiResponse';
import { LocationListItem } from '../models/interfaces/LocationListItem';
import { PositionListItem } from '../models/interfaces/PositionListItem';
import { baseUrl } from '../../baseURL';
@Injectable({
  providedIn: 'root'
})
export class SurveyServiceService {

    private http = inject(HttpClient);
   getDepartments(onlyActive = true): Observable<DepartmentListItem[]> {
    const params = new HttpParams().set('onlyActive', onlyActive);
    return this.http.get<ApiResponse<DepartmentListItem[]>>(
      `${baseUrl}api/Departement/GetAll`, { params }
    ).pipe(map(r => r.data ?? []));
  }

  getPositions(onlyActive = true): Observable<PositionListItem[]> {
    const params = new HttpParams().set('onlyActive', onlyActive);
    return this.http.get<ApiResponse<PositionListItem[]>>(
      `${baseUrl}api/Position/GetAll`, { params }
    ).pipe(map(r => r.data ?? []));
  }

  /** Locations are computed from Employee.City on the backend */
  getLocations(onlyActive = true): Observable<LocationListItem[]> {
    const params = new HttpParams().set('onlyActive', onlyActive);
    return this.http.get<ApiResponse<LocationListItem[]>>(
      `${baseUrl}api/Location/GetAll`, { params }
    ).pipe(map(r => r.data ?? []));
  }
  getDepartmentsByCities(cities: string[], onlyActive = true): Observable<DepartmentListItem[]> {
  let params = new HttpParams().set('onlyActive', String(onlyActive));
  if (cities?.length) params = params.set('locationCities', cities.join(','));
  return this.http
    .get<ApiResponse<DepartmentListItem[]>>(`${baseUrl}api/Departement/GetLookupByCities`, { params })
    .pipe(map(r => r.data ?? []));
}

getPositionsByFilters(cities: string[], departmentIds: number[], onlyActive = true): Observable<PositionListItem[]> {
  let params = new HttpParams().set('onlyActive', String(onlyActive));
  if (cities?.length) params = params.set('locationCities', cities.join(','));
  if (departmentIds?.length) params = params.set('departmentIds', departmentIds.join(','));
  return this.http
    .get<ApiResponse<PositionListItem[]>>(`${baseUrl}api/Position/GetLookupByFilters`, { params })
    .pipe(map(r => r.data ?? []));
}
}

