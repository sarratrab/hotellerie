import { Routes } from '@angular/router';

import { EditTypeComponent } from './components/edit-type/edit-type.component';

import { ActiveTemplateComponent } from './components/active-template/active-template.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { FormDesignerComponent } from './components/form-designer/form-designer.component';
import { AddTemplateComponent } from './components/add-template/add-template.component';

import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { InactiveTemplateComponent } from './components/inactive-template/inactive-template.component';
import { HomeComponent } from './components/home/home.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { TemplateDetailComponent } from './components/template-detail/template-detail.component';
import { AddTypeComponent } from './components/add-type/add-type.component';



export const routes: Routes = [  
     { path: '', component: HomeComponent },
     {path : 'addtemp' , component : AddTemplateComponent},
     {path : 'active-templates' , component : ActiveTemplateComponent},
     {path : 'home' , component : HomeComponent},
     {path : 'navbar' , component : NavbarComponent},
     {path : 'inactive-templates' , component : InactiveTemplateComponent},
     {path : 'preferences' , component : PreferencesComponent},
     {path : 'templates/:id' , component : TemplateDetailComponent},
     {path : 'edit-template/:id' , component : EditTemplateComponent},
     {path : 'addtype' , component : AddTypeComponent},
     { path: 'edittype/:id', component: EditTypeComponent },
     
     
     


];
