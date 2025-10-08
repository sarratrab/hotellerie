import { Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, ButtonModule, TieredMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  
@ViewChild('menu') menu!: TieredMenu;

  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      { label: 'CoreHR', command: () => this.router.navigate(['/home']) },
      { label: 'Payroll', command: () => console.log('Payroll clicked') },
      { label: 'Talent', command: () => console.log('Talent clicked') },
      { label: 'Time (Beta)', command: () => console.log('Time clicked') },
      { label: 'Assets', command: () => console.log('Assets clicked') },
      { label: 'Expenses', command: () => console.log('Expenses clicked') },
      { label: 'Analytics (Beta)', command: () => console.log('Analytics clicked') },
      { label: 'Surveys', command: () => this.router.navigate(['/active-templates']) }
    ];
  }


  toggleMenu(event: Event) {
    this.menu.toggle(event);
  }
  currentUrl = signal<string>('');


  activeTab = computed(() => {
    const url = this.currentUrl();
    if (url.includes('home')) return 'Home';
    if (url.includes('Surveys-employee')) return 'My HR';
    if (url.includes('My Leave')) return 'My Leave';
    if (url.includes('My Expenses')) return 'My Expenses';
    if (url.includes('My Time')) return 'My Time';
    if (url.includes('My Payroll')) return 'My Payroll';
    if (url.includes('My Talent')) return 'My Talent';
    if (url.includes('Employees')) return 'Employees';
    if (url.includes('Reports')) return 'Reports';
    return '';
  });

  constructor(private router: Router) {
    // Mettre à jour currentUrl à chaque navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
