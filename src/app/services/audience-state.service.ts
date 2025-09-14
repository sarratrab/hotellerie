import { Injectable } from '@angular/core';
import { AudienceSelection } from '../models/interfaces/AudienceSelection';
const EMPTY: AudienceSelection = {
  allEmployees: false,
  departmentIds: [],
  positionIds: [],
  cities: []
};
@Injectable({
  providedIn: 'root'
})
export class AudienceStateService {
  private _selection: AudienceSelection = { ...EMPTY };

  setSelection(sel: AudienceSelection) {
    // clone défensif
    this._selection = JSON.parse(JSON.stringify(sel));
  }

  getSelection(): AudienceSelection {
    return this._selection;
  }

  clear() { this._selection = { ...EMPTY }; }
}