
import { Component, computed, OnInit,  signal} from '@angular/core';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TieredMenu } from 'primeng/tieredmenu';
import { ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-survey-navbar',
  imports: [TieredMenuModule,CommonModule,ButtonModule],
  templateUrl: './survey-navbar.component.html',
  styleUrl: './survey-navbar.component.css'
})
export class SurveyNavbarComponent implements OnInit{
  
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
    if (url.includes('surveys')) return 'surveys';
    if (url.includes('history')) return 'history';
    if (url.includes('active-templates')) return 'templates';
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

