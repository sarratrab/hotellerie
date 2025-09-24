import { Routes } from '@angular/router';

import { EditTypeComponent } from './components/edit-type/edit-type.component';

import { ActiveTemplateComponent } from './components/active-template/active-template.component';
import { NavbarComponent } from './components/navbar/navbar.component';


import { AddTemplateComponent } from './components/add-template/add-template.component';

import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { InactiveTemplateComponent } from './components/inactive-template/inactive-template.component';
import { HomeComponent } from './components/home/home.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { TemplateDetailComponent } from './components/template-detail/template-detail.component';
import { AddTypeComponent } from './components/add-type/add-type.component';
import { SurveyComponent } from './components/survey/survey.component';
import { LanchSurveyComponent } from './components/lanch-survey/lanch-survey/lanch-survey.component';
import { HistoryComponent } from './components/history/history.component';
import { EmployeeSelectorComponent } from './components/lanch-survey/employee-selector/employee-selector.component';
import { TargetAudiencePanelComponent } from './components/lanch-survey/target-audience-panel/target-audience-panel.component';
import { LanchSurveyFooterComponent } from './components/lanch-survey/lanch-survey-footer/lanch-survey-footer.component';
import { SurveyInfo } from './components/lanch-survey/step1-survey-info/step1-survey-info.component';



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
     { path: 'surveys', component: SurveyComponent },
     {path : 'history' , component : HistoryComponent},
     
     {path : 'lanch-footer' , component : LanchSurveyFooterComponent},
     
{
  path: 'lanch-survey',
  component: LanchSurveyComponent,
  children: [
    { path: '', redirectTo: 'step1', pathMatch: 'full' },

    {
      path: 'step1',
      component: SurveyInfo,
      data: { cancelLabel: 'Cancel', nextLabel: 'Next' }
    },
    {
      path: 'step2',
      component: TargetAudiencePanelComponent,
      data: { cancelLabel: 'Previous', nextLabel: 'Next' }
    },
    {
      path: 'step3',
      component: EmployeeSelectorComponent,
      data: { cancelLabel: 'Previous', nextLabel: 'Finish' }
    }
  ]
}

,{
    path: 'lanch-survey/:id',
    component: LanchSurveyComponent,
    children: [
      { path: 'step1', component: SurveyInfo   },
      { path: 'step2', component: TargetAudiencePanelComponent },
      { path: 'step3', component: EmployeeSelectorComponent },
      { path: '', redirectTo: 'step1', pathMatch: 'full' }
    ]
  }

     


];
