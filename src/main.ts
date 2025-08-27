import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';

import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationService, MessageService, } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
    provideAnimations() , 
     importProvidersFrom(HttpClientModule) ,MessageService,ConfirmationService,DialogService,DynamicDialogRef
  ]
}).catch(err => console.error(err));
