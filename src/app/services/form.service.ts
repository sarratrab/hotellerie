import {
  ApplicationRef,
  computed,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { FormField } from '../models/field.model';
import { FormRow } from '../models/form.model';
import { FieldTypesService } from './field-types.service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private _rows = signal<FormRow[]>([]);
  private _selectedFieldId = signal<string | null>(null);

  private appRef = inject(ApplicationRef);
  private fieldTypesService = inject(FieldTypesService);

  public readonly rows = this._rows.asReadonly();
  public readonly selectedField = computed(() => {
    return this._rows()
      .flatMap((row) => row.fields)
      .find((field) => field.id === this._selectedFieldId());
  });

  constructor() {
     (window as any).formService = this;
    this._rows.set([
      {
        id: crypto.randomUUID(),
        fields: [],
      },
    ]);
  }

  addField(field: FormField, rowId: string, index?: number) {
    document.startViewTransition(() => {
      const rows = this._rows();
      const newRows = rows.map((row) => {
        if (row.id === rowId) {
          const updatedFields = [...row.fields];
          if (index !== undefined) {
            updatedFields.splice(index, 0, field);
          } else {
            updatedFields.push(field);
          }
          return { ...row, fields: updatedFields };
        }
        return row;
      });
      this._rows.set(newRows);
    });
  }

  updateField(fieldId: string, data: Partial<FormField>) {
    const rows = this._rows();
    const newRows = rows.map((row) => ({
      ...row,
      fields: row.fields.map((f) => (f.id === fieldId ? { ...f, ...data } : f)),
    }));
    this._rows.set(newRows);
  }

  getRows() {
    return this._rows();
  }

  addRow() {
    const newRow: FormRow = {
      id: crypto.randomUUID(),
      fields: [],
    };
    document.startViewTransition(() => {
      const rows = this._rows();
      this._rows.set([...rows, newRow]);
    });
    return newRow.id;
  }

  moveRowUp(rowId: string) {
    document.startViewTransition(() => {
      const rows = this._rows();
      const index = rows.findIndex((row) => row.id === rowId);
      if (index > 0) {
        const newRows = [...rows];
        const temp = newRows[index - 1];
        newRows[index - 1] = newRows[index];
        newRows[index] = temp;
        this._rows.set(newRows);
      }
    });
  }

  moveRowDown(rowId: string) {
    document.startViewTransition(() => {
      const rows = this._rows();
      const index = rows.findIndex((row) => row.id === rowId);
      if (index < rows.length - 1) {
        const newRows = [...rows];
        const temp = newRows[index + 1];
        newRows[index + 1] = newRows[index];
        newRows[index] = temp;
        this._rows.set(newRows);
      }
    });
  }

  moveField(
    fieldId: string,
    sourceRowId: string,
    targetRowId: string,
    targetIndex: number = -1,
  ) {
    // This method moves a field from one row to another
    document.startViewTransition(() => {
      const rows = this._rows();

      // Step 1: Find the field we want to move
      let fieldToMove: FormField | undefined;
      let sourceRowIndex = -1;
      let sourceFieldIndex = -1;

      // Find the source row and field
      rows.forEach((row, rowIndex) => {
        if (row.id === sourceRowId) {
          sourceRowIndex = rowIndex;
          sourceFieldIndex = row.fields.findIndex((f) => f.id === fieldId);
          if (sourceFieldIndex >= 0) {
            fieldToMove = row.fields[sourceFieldIndex];
          }
        }
      });

      // If we didn't find the field, return
      if (!fieldToMove) return;

      // Step 2: Create a new array of rows for immutability
      const newRows = [...rows];

      // Step 3: Remove the field from its source row
      const fieldsWithRemovedField = newRows[sourceRowIndex].fields.filter(
        (f) => f.id !== fieldId,
      );
      newRows[sourceRowIndex].fields = fieldsWithRemovedField;

      // Step 4: Add the field to the target row
      const targetRowIndex = newRows.findIndex((row) => row.id === targetRowId);
      if (targetRowIndex >= 0) {
        const targetFields = [...newRows[targetRowIndex].fields];

        // Insert at specific position
        targetFields.splice(targetIndex, 0, fieldToMove);
        newRows[targetRowIndex].fields = targetFields;
      }

      this._rows.set(newRows);
      this.appRef.tick();
    });
  }

  removeRow(rowId: string) {
    if (this._rows().length === 1) {
      return;
    }

    document.startViewTransition(() => {
      const rows = this._rows();
      const newRows = rows.filter((row) => row.id !== rowId);
      this._rows.set(newRows);
      this.appRef.tick();
    });
  }

  deleteField(fieldId: string) {
    document.startViewTransition(() => {
      const rows = this._rows();
      const newRows = rows.map((row) => ({
        ...row,
        fields: row.fields.filter((field) => field.id !== fieldId),
      }));
      this._rows.set(newRows);
      this.appRef.tick();
    });

    this._selectedFieldId.set(null);
  }

  exportForm(): string {
    const formCode = this.generateFormCode();
    const blob = new Blob([formCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form.ts';
    link.click();
    window.URL.revokeObjectURL(url);
    return formCode;
  }

  private generateFormCode(): string {
    let code = this.generateImports();
    code += this.generateComponentDecorator();
    code += `  template: \`\n`;
    code += `    <form class="flex flex-col gap-4">\n`;

    for (const row of this._rows()) {
      if (row.fields.length > 0) {
        code += `      <div class="flex gap-4 flex-wrap">\n`;
        for (const field of row.fields) {
          code += `        <div class="flex-1">\n`;
          code += this.generateFieldCode(field);
          code += `        </div>\n`;
        }
        code += `      </div>\n`;
      }
    }

    code += `    </form>\n`;
    code += `  \`\n`;
    code += `})\n`;
    code += `export class GeneratedFormComponent {\n`;
    code += `}\n`;

    return code;
  }

  private generateImports(): string {
    return (
      `import { Component } from '@angular/core';\n` +
      `import { CommonModule } from '@angular/common';\n` +
      `import { FormsModule } from '@angular/forms';\n` +
      `import { MatFormFieldModule } from '@angular/material/form-field';\n` +
      `import { MatInputModule } from '@angular/material/input';\n` +
      `import { MatSelectModule } from '@angular/material/select';\n` +
      `import { MatCheckboxModule } from '@angular/material/checkbox';\n` +
      `import { MatRadioModule } from '@angular/material/radio';\n` +
      `import { MatDatepickerModule } from '@angular/material/datepicker';\n` +
      `import { MatNativeDateModule } from '@angular/material/core';\n` +
      `import { MatButtonModule } from '@angular/material/button';\n\n`
    );
  }

  private generateComponentDecorator(): string {
    return (
      `@Component({\n` +
      `  selector: 'app-generated-form',\n` +
      `  standalone: true,\n` +
      `  imports: [\n` +
      `    CommonModule,\n` +
      `    FormsModule,\n` +
      `    MatFormFieldModule,\n` +
      `    MatInputModule,\n` +
      `    MatSelectModule,\n` +
      `    MatCheckboxModule,\n` +
      `    MatRadioModule,\n` +
      `    MatDatepickerModule,\n` +
      `    MatNativeDateModule,\n` +
      `    MatButtonModule\n` +
      `  ],\n`
    );
  }

  private generateFieldCode(field: FormField): string {
    const fieldDef = this.fieldTypesService.getFieldType(field.type);
    return fieldDef?.generateCode(field) || '';
  }

  setSelectedField(fieldId: string) {
    this._selectedFieldId.set(fieldId);
  }

exportTemplateDefinition(): string {
  return JSON.stringify(this._rows(), null, 2);
}
  resetRows() {
    document.startViewTransition(() => {
      this._rows.set([
        {
          id: crypto.randomUUID(),
          fields: [],
        },
      ]);
      this._selectedFieldId.set(null);
      this.appRef.tick();
    });
  }

  loadRows(rows: FormRow[]) {
    this._rows.set(rows);
  }


}
