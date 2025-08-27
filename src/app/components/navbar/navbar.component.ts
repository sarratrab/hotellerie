import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, ButtonModule, TieredMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) { } 
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
}
