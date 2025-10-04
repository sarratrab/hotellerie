import { Component, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-template-navbar',
  imports: [
    TieredMenuModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './template-navbar.component.html',
  styleUrl: './template-navbar.component.css'
})
export class TemplateNavbarComponent {

  currentUrl = signal<string>('');

  activeTab = computed(() => {
    const url = this.currentUrl();
    if (url.includes('inactive-templates')) return 'Inactive Templates';
    if (url.includes('active-templates')) return 'Active Templates';
    if (url.includes('preferences')) return 'Preferences';
    return '';
  });

  constructor(private router: Router) {
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
