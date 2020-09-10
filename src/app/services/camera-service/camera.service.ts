import { StorageService } from '../storage/storage.service'
import { HttpService } from '../http/http.service'

import * as moment from 'moment'
import { Injectable } from '@angular/core'
import { SocketService } from '../socket/socket.service'
import { NetworkService } from '../network/network.service'
import { ToastService } from '../toast/toast.service'
import { TranslateService } from '@ngx-translate/core'
import { ActionSheetController } from '@ionic/angular'
import { Camera } from '@ionic-native/camera/ngx'

@Injectable({
    providedIn: 'root'
})

export class CameraService {
    constructor(
        private storageService: StorageService,
        private toast: ToastService,
        private httpService: HttpService,
        private socketService: SocketService,
        private network: NetworkService,
        private translate: TranslateService,
        private asCtrl: ActionSheetController,
        private camera: Camera) {
    }

    public async setPhoto() {
        return new Promise(async (resolve, reject) => {
            if (this.network.online()) {
                const actionSheet = await this.asCtrl.create({
                    header: 'Profile Photo',
                    buttons: [
                        {
                            text: 'Take a Photo',
                            role: 'destructive',
                            handler: () => {
                                let cameraOptions = {
                                    sourceType: this.camera.PictureSourceType.CAMERA,
                                    destinationType: this.camera.DestinationType.DATA_URL,
                                    quality: 100,
                                    targetWidth: 500,
                                    targetHeight: 500,
                                    encodingType: this.camera.EncodingType.PNG,
                                }
                                this.camera.getPicture(cameraOptions)
                                    .then(async file_uri => {
                                        const base64Image = 'data:image/jpeg;base64,' + file_uri
                                        const token = await this.storageService.getToken()
                                        const email = await this.storageService.getUserEmail()
                                        this.storageService.setProfilePicture(base64Image)
                                        this.httpService.saveUserProfilePicture(token, email, base64Image)
                                            .then(_ => {
                                                console.log('user photo saved to database')
                                            })
                                            .catch(err => {
                                                this.toast.showToast(err.code)
                                                return reject(err.code)
                                            })
                                        return resolve()
                                    },
                                        err => console.log(err))
                            }
                        },
                        {
                            text: 'Choose from Gallery',
                            handler: () => {
                                let cameraOptions = {
                                    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                                    destinationType: this.camera.DestinationType.DATA_URL,
                                    quality: 100,
                                    targetWidth: 500,
                                    targetHeight: 500,
                                    encodingType: this.camera.EncodingType.PNG,
                                    correctOrientation: true
                                }
                                this.camera.getPicture(cameraOptions)
                                    .then(async file_uri => {
                                        const base64Image = 'data:image/jpeg;base64,' + file_uri
                                        const token = await this.storageService.getToken()
                                        const email = await this.storageService.getUserEmail()
                                        this.storageService.setProfilePicture(base64Image)
                                        this.httpService.saveUserProfilePicture(token, email, base64Image)
                                            .then(_ => {
                                                console.log('user photo saved to database')
                                            })
                                            .catch(err => {
                                                this.toast.showToast(err.code)
                                                return reject(err.code)
                                            })
                                        return resolve()
                                    },
                                        err => console.log(err))
                            }
                        },
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => { }
                        }
                    ]
                })

                await actionSheet.present()
            }
        })
    }
}