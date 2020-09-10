import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export class ActionSheetService {
    constructor(private actionSheetController: ActionSheetController) { }

    async goToSettings() {
        return new Promise(async (resolve, reject) => {
            const actionSheet = await this.actionSheetController.create({
                header: 'Settings',
                buttons: [{
                    text: 'Change Subscription',
                    role: 'destructive',
                    icon: 'card',
                    handler: async () => {
                        resolve('subscription')
                        return true
                    }
                }, {
                    text: 'Reset Password',
                    icon: 'key',
                    handler: () => {
                        return resolve('reset')
                    }
                },
                {
                    text: 'Delete Account',
                    role: 'destructive',
                    icon: 'trash',
                    handler: async () => {
                        resolve('delete')
                        return true
                    }
                }]
            })
            await actionSheet.present()
        })
    }
}