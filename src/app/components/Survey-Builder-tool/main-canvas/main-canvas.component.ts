import { Component, inject, signal } from '@angular/core';
import { FormEditorComponent } from "./form-editor/form-editor.component";

import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { FormPreviewComponent } from "./form-preview/form-preview.component";
import { ButtonGroupModule } from 'primeng/buttongroup';
import { FormService } from '../../../services/form.service';
@Component({
  selector: 'app-main-canvas',
  imports: [FormEditorComponent,ButtonGroupModule, SelectButtonModule, FormsModule, FormPreviewComponent],
  templateUrl: './main-canvas.component.html',
  styleUrl: './main-canvas.component.css'
})
export class MainCanvasComponent {
  tabs = [
  { label: 'Editor', value: 'editor' },
  { label: 'Preview', value: 'preview' },
];
formService = inject(FormService);
  activeTab = signal<'editor' | 'preview'>('editor');

  setActiveTab(tab: 'editor' | 'preview') {
    this.activeTab.set(tab);
  }
}
