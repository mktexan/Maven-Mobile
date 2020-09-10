import { AlertController, NavController } from '@ionic/angular'
import { TranslateService } from '@ngx-translate/core'
import { LoadingService } from '../loading/loading.service'
import { HttpService } from '../http/http.service'
import { ToastService } from '../toast/toast.service'
import { Storage } from '@ionic/storage'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})

export class AlertService {
    constructor(
        public alertController: AlertController,
        private translate: TranslateService,
        public loading: LoadingService,
        private httpService: HttpService,
        private toast: ToastService,
        public storage: Storage,
        public navCtrl: NavController) { }

    public async linkTwitter() {
        const alert = await this.alertController.create({
            header: 'Link Twitter?',
            message: '<p>Would you like to link your Twitter account to <i>Maven?</i></p>',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah')
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        console.log('Confirm Okay')
                    }
                }
            ]
        })

        await alert.present()
    }

    public async linkSnapChat() {
        const alert = await this.alertController.create({
            header: 'Link Snapchat?',
            message: '<p>Would you like to link your Snapchat account to <i>Maven?</i></p>',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah')
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        console.log('Confirm Okay')
                    }
                }
            ]
        })

        await alert.present()
    }

    public async linkLinkedin() {
        const alert = await this.alertController.create({
            header: 'Link Linkedin?  (That isnt easy to say!)',
            message: '<p>Would you like to link your Linkedin account to <i>Maven?</i></p>',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah')
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        console.log('Confirm Okay')
                    }
                }
            ]
        })

        await alert.present()
    }

    public async linkFacebook() {
        const alert = await this.alertController.create({
            header: 'Link Facebook?',
            message: '<p>Would you like to link your Facebook account to <i>Maven?</i></p>',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah')
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        console.log('Confirm Okay')
                    }
                }
            ]
        })

        await alert.present()
    }

    public async linkInstagram() {
        const alert = await this.alertController.create({
            header: 'Link Instagram?',
            message: '<p>Would you like to link your Instagram account to <i style = "color:#408cbd">Maven?</i></p>',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah')
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        console.log('Confirm Okay')
                    }
                }
            ]
        })

        await alert.present()
    }

    public async forgotPass(email) {
        return new Promise(async (resolve, reject) => {
            const alert = await this.alertController.create({
                header: 'Reset Password',
                message: 'After confirming, you will be logged out. Please check your email for a link to reset your password',
                inputs: [
                    {
                        name: 'email',
                        type: 'email',
                        placeholder: email
                    }
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => { reject() }
                    }, {
                        text: 'Confirm',
                        handler: async (input) => {
                            const loader = await this.loading.loadingController.create({
                                duration: 3000
                            })
                            loader.present()

                            this.httpService.resetPassword(email).then(_ => {
                                loader.dismiss()
                                this.toast.showToast('Password reset email sent.')
                                this.storage.clear()
                                this.navCtrl.navigateRoot('/login')
                                resolve()
                            }).catch(err => {
                                loader.dismiss()
                                this.toast.showToast('Error sending password reset email. Try again later.')
                                reject()
                            })
                        }
                    }
                ]
            })
            await alert.present()
        })
    }

    async deleteAccountAlert() {
        return new Promise(async (resolve, reject) => {
            const alert = await this.alertController.create({
                header: 'Delete Account?',
                message: 'Are you sure? This action will remove ALL account and message data from Maven servers. This action can not be reversed! ',
                buttons: [
                    {
                        text: 'No',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: (blah) => {
                            return resolve(false)
                        }
                    }, {
                        text: 'Yes',
                        handler: async () => {
                            return resolve(true)
                        }
                    }
                ]
            })

            await alert.present()
        })
    }

}