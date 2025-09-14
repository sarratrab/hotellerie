import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LaunchSurveyStateService {
  private _templateId?: string;
  private _templateName?: string;

  setTemplate(t: { id: string; name?: string }) {
    this._templateId = t.id;
    this._templateName = t.name;
  }

  get templateId()   { return this._templateId; }
  get templateName() { return this._templateName; }

  clear() {
    this._templateId = undefined;
    this._templateName = undefined;
  }
}