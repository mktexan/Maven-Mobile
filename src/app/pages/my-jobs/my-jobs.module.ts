import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { MyJobsPage } from './my-jobs.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        TranslateModule.forChild(),
        RouterModule.forChild([
            {
                path: '',
                component:MyJobsPage
            }
        ])
    ],
    declarations: [MyJobsPage]
})
export class MyJobsPageModule { }
