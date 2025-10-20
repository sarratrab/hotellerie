import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface StatCard {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface TodoItem {
  id: number;
  text: string;
  date: string;
  tag: string;
  completed: boolean;
}

@Component({
  selector: 'app-dashboard-executive',
  imports: [],
  templateUrl: './dashboard-executive.component.html',
  styleUrl: './dashboard-executive.component.css'
})
export class DashboardExecutiveComponent implements OnInit {
  currentDate: string;
  userName: string = 'John Doe';
  
  stats: StatCard[] = [
    { label: 'Bounce Rate', value: '32.53%', change: '-0.5%', isPositive: false },
    { label: 'Page Views', value: '7.682', change: '+0.1%', isPositive: true },
    { label: 'New Sessions', value: '68.8', change: '68.8', isPositive: false },
    { label: 'Avg. Time on Site', value: '2m:35s', change: '+0.8%', isPositive: true },
    { label: 'New Sessions', value: '68.8', change: '68.8', isPositive: false },
    { label: 'Avg. Time on Site', value: '2m:35s', change: '+0.8%', isPositive: true }
  ];

  statusSummary = {
    closedValue: 357,
    totalVisitors: '26.80%',
    visitsPerDay: 9065
  };

  todoItems: TodoItem[] = [
    {
      id: 1,
      text: 'Lorem ipsum is simply dummy text of the printing',
      date: '24 June 2020',
      tag: 'Due tomorrow',
      completed: false
    }
  ];

  activeTab: string = 'Overview';
  selectedCategory: string = 'Select Category';

  constructor(private router:Router) {
    this.currentDate = this.getTodayDate();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadDashboardData(): void {
    // Charger les données depuis un service
    console.log('Dashboard data loaded');
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  onCategoryChange(event: any): void {
    this.selectedCategory = event.target.value;
  }

  onDateChange(event: any): void {
    this.currentDate = event.target.value;
  }

  exportData(): void {
    console.log('Exporting data...');
  }

  printDashboard(): void {
    window.print();
  }

  shareDashboard(): void {
    console.log('Sharing dashboard...');
  }

  toggleTodo(todo: TodoItem): void {
    todo.completed = !todo.completed;
  }

  addTodo(text: string): void {
    const newTodo: TodoItem = {
      id: this.todoItems.length + 1,
      text: text,
      date: new Date().toLocaleDateString(),
      tag: 'New',
      completed: false
    };
    this.todoItems.push(newTodo);
  }
    navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
