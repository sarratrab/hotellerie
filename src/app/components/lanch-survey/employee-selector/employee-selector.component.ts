import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';

interface Employee {
  id: number;
  name: string;
}

@Component({
  selector: 'app-employee-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CheckboxModule, InputTextModule, PaginatorModule],
  templateUrl: './employee-selector.component.html',
  styleUrls: ['./employee-selector.component.css']
})
export class EmployeeSelectorComponent {
  employees: Employee[] = [
    { id: 1, name: 'Yasmine' },
    { id: 2, name: 'Ameni' },
    { id: 3, name: 'Yassine' },
    { id: 4, name: 'Mohamed' },
    { id: 5, name: 'Ahmed' },
  ];

  selectedEmployees: Employee[] = [];
  rowsPerPage = 5;

  onGlobalFilter(table: any, event: Event) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
}
