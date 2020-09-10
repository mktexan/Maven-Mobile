import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { IndividualChatPage } from './individual-chat.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule.forChild(),
        RouterModule.forChild([
            {
                path: '',
                component: IndividualChatPage
            }
        ])
    ],
    declarations: [IndividualChatPage]
})
export class IndividualChatPageModule { }
