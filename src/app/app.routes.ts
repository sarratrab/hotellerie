import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardMarketingComponent } from './components/dashboard-marketing/dashboard-marketing.component';
import { DashboardExecutiveComponent } from './components/dashboard-executive/dashboard-executive.component';
import { DashboardManagerComponent } from './components/dashboard-manager/dashboard-manager.component';




export const routes: Routes = [  
     { path: '', component: HomeComponent },
      {
    path: 'DashboardMarketing',
    component: DashboardMarketingComponent
  },      {
    path: 'DashboardExecutive',
    component:DashboardExecutiveComponent
  },
      {
    path: 'DashboardManager',
    component: DashboardManagerComponent
  }

     


];
