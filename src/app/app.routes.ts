import { Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { SurveyAnswerComponent } from './components/response-manag/survey-answer/survey-answer.component';
import { AddTemplateComponent } from './components/Template-Mang/add-template/add-template.component';
import { PreferencesComponent } from './components/preference/preferences/preferences.component';
import { TemplateDetailComponent } from './components/Template-Mang/template-detail/template-detail.component';
import { EditTemplateComponent } from './components/Template-Mang/edit-template/edit-template.component';
import { AddTypeComponent } from './components/preference/add-type/add-type.component';
import { EditTypeComponent } from './components/preference/edit-type/edit-type.component';
import { LanchSurveyFooterComponent } from './components/Survey-Manag/lanch-survey/lanch-survey-footer/lanch-survey-footer.component';
import { LanchSurveyComponent } from './components/Survey-Manag/lanch-survey/lanch-survey/lanch-survey.component';
import { SurveyInfo } from './components/Survey-Manag/lanch-survey/step1-survey-info/step1-survey-info.component';
import { TargetAudiencePanelComponent } from './components/Survey-Manag/lanch-survey/target-audience-panel/target-audience-panel.component';
import { EmployeeSelectorComponent } from './components/Survey-Manag/lanch-survey/employee-selector/employee-selector.component';
import { GetTemplatesComponent } from './components/Template-Mang/get-templates/get-templates.component';
import { GetSurveysComponent } from './components/Survey-Manag/get-surveys/get-surveys.component';
import { SurveyEmployeeComponent } from './components/response-manag/survey-employee/survey-employee.component';
import { ViewResponseComponent } from './components/response-manag/view-response/view-response.component';
import { SurveyViewAnswerComponent } from './components/response-manag/viewanswer/viewanswer.component';



export const routes: Routes = [  
     { path: '', component: HomeComponent },
      {
    path: 'templates',
    component: GetTemplatesComponent
  },      {
    path: 'Surveys-employee',
    component:SurveyEmployeeComponent
  },
      {
    path: 'active-templates',
    component: GetTemplatesComponent,
    data: { isActivePage: true }
  },
  {
    path: 'inactive-templates',
    component: GetTemplatesComponent,
    data: { isActivePage: false }
  },
  { 
    path: 'surveys', 
    component: GetSurveysComponent, 
    data: { status: 'open' } // ✅ open surveys
  },
  {
    path: "surveys/seeanswer/:id",
    component : ViewResponseComponent, 
  },
  {path: "surveys/:surveyId/answers",
    component: SurveyViewAnswerComponent,
  },
  { 
    path: 'history', 
    component: GetSurveysComponent, 
    data: { status: 'completed' } // ✅ completed surveys
  },
     {path : 'addtemp' , component : AddTemplateComponent},
    
     {path : 'home' , component : HomeComponent},
     {path : 'navbar' , component : NavbarComponent},
  
     {path : 'preferences' , component : PreferencesComponent},
     {path : 'templates/:id' , component : TemplateDetailComponent},
     {path : 'edit-template/:id' , component : EditTemplateComponent},
     {path : 'addtype' , component : AddTypeComponent},
     { path: 'edittype/:id', component: EditTypeComponent },
     
  {
    path: 'surveys/:surveyId/answer',
    component: SurveyAnswerComponent,
  },
     {path : 'lanch-footer' , component : LanchSurveyFooterComponent},
     
{
  path: 'lanch-survey',
  component: LanchSurveyComponent,
  children: [
    { path: '', redirectTo: 'step1', pathMatch: 'full' },

    {
      path: 'step1',
      component: SurveyInfo,
      data: { cancelLabel: 'Cancel', nextLabel: 'Next' , showExtraCancel: false } // NEW
    },
    {
      path: 'step2',
      component: TargetAudiencePanelComponent,
      data: { cancelLabel: 'Previous', nextLabel: 'Next', showExtraCancel: true } // NEW
    },
    {
      path: 'step3',
      component: EmployeeSelectorComponent,
      data: { cancelLabel: 'Previous', nextLabel: 'Finish', showExtraCancel: true } // NEW
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
