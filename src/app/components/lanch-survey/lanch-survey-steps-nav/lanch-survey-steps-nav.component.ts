import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-lanch-survey-steps-nav',
  imports: [StepsModule, ToastModule],
  templateUrl: './lanch-survey-steps-nav.component.html',
  styleUrl: './lanch-survey-steps-nav.component.css',
  providers: [MessageService]
})
export class LanchSurveyStepsNavComponent implements OnInit {

 items: MenuItem[] | undefined;

    

    constructor(public messageService: MessageService, ) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Target Audience',
                routerLink: 'step1'
            },
            {
                label: 'Select Employees',
                routerLink: 'step2'
            },
            {
                label: 'Settings',
                routerLink: 'step3'
            },
           
        ];

        
    }

    ngOnDestroy() {
       
    }
}
