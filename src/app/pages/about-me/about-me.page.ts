import { Component, NgZone, ChangeDetectorRef } from '@angular/core'
import { NavController, MenuController, AlertController, ModalController, ActionSheetController } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import {
    AuthService, NetworkService, HttpService,
    SocketService, MessageService, LoadingService,
    ToastService, StorageService, TranslateProvider
} from '../../services'
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx'
import * as moment from 'moment'
import { Subscription } from 'rxjs'
import { Action } from 'rxjs/internal/scheduler/Action'
import { Camera } from '@ionic-native/camera/ngx'

import * as uuid from 'uuid'
import { bounce } from 'ng-animate'

@Component({
    selector: 'about-me',
    templateUrl: 'about-me.page.html',
    styleUrls: ['about-me.page.scss'],
})

export class AboutMePage {
    private profilePhoto = '../../assets/img/profile.png'
    private maven = 'assets/img/maven-black.jpg'
    private accountType: any
    private profilePicture: any
    public userName: any
    public userEmail: any
    private fakeAboutMe = 'text'

    private hasLocalImages = true

    public isBusiness = false
    public isInfluencer = false

    private userTags = []
    private userImages: any
    private portfolioImages = []

    constructor(
        private changeDetection: ChangeDetectorRef,
        private camera: Camera,
        private actionSheet: ActionSheetController,
        private translate: TranslateProvider,
        public storageService: StorageService,
        public modalController: ModalController,
        public alertController: AlertController,
        private toast: ToastService,
        public loading: LoadingService,
        private messageService: MessageService,
        private socketService: SocketService,
        private nativeGeocoder: NativeGeocoder,
        private httpService: HttpService,
        public network: NetworkService,
        public auth: AuthService,
        public menuCtrl: MenuController,
        public navCtrl: NavController,
        public domSanitizer: DomSanitizer
    ) {
        this.menuCtrl.enable(true)
    }

    private setEmail(email: any) {
    }

    ionViewWillLeave() {
    }

    async ionViewDidEnter() {
    }

    async ionViewWillEnter() {
        if (!this.network.online()) return this.toast.showToast('No internet connection. Page data can not sync with Maven servers. Please connect to the internet and try again.')
        let accountType = await this.storageService.getAccountType()
        const email = await this.storageService.getUserEmail()
        const name = await this.storageService.getUserName()
        const profileImage = await this.storageService.getProfilePicture()
        const pics = await this.storageService.getPortfolioPictures()
        const localBio = await this.storageService.getUserBiography()

        if (!pics) {
            this.hasLocalImages = false
            const images = await this.httpService.getPortfolioImages(email)
            this.userImages = images
        }
        else this.userImages = pics

        if (profileImage) this.profilePicture = profileImage

        if (accountType === 'business') this.isBusiness = true
        else {
            accountType = 'Job Seeker'
            this.isInfluencer = true
        }

        this.userEmail = email
        this.userName = name
        this.accountType = accountType

        if (!localBio) {
            const biography = await this.httpService.getBiography()
            this.fakeAboutMe = biography['bio']
        } else this.fakeAboutMe = localBio
    }

    async setPhoto() {
        if (!this.network.online()) return

        const actionSheet = await this.actionSheet.create({
            header: 'Add Portfolio Picture',
            buttons: [
                {
                    text: this.translate.get('auth.profile.photo.take'),
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
                                const myId = uuid.v4()
                                const base64Image = 'data:image/jpeg;base64,' + file_uri
                                const token = await this.storageService.getToken()

                                this.addImage(base64Image, myId)

                                const data = { image: base64Image, uuid: myId }

                                this.httpService.addPortfolioImage(token, data)
                                    .then(_ => {
                                        this.toast.showToast('Image uploaded to Maven')
                                    })
                                    .catch(err => {
                                        this.toast.showToast(this.translate.get('Image failed to save to Maven servers. Process will auto retry later.'))
                                    })
                            }, err => console.log(err))
                    }
                },
                {
                    text: this.translate.get('auth.profile.photo.gallery'),
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
                                const myId = uuid.v4()
                                const base64Image = 'data:image/jpeg;base64,' + file_uri
                                const token = await this.storageService.getToken()

                                this.addImage(base64Image, myId)

                                const data = { image: base64Image, uuid: myId }

                                this.httpService.addPortfolioImage(token, data)
                                    .then(_ => {
                                        this.toast.showToast('Image uploaded to Maven')
                                    })
                                    .catch(err => {
                                        this.toast.showToast(this.translate.get('Image failed to save to Maven servers. Process will auto retry later.'))
                                    })
                            }, err => console.log(err))
                    }
                },
                {
                    text: this.translate.get('auth.profile.photo.cancel'),
                    role: 'cancel',
                    handler: () => { }
                }
            ]
        })

        await actionSheet.present()
    }

    private async updateBiography(biography: any) {
        await this.storageService.setUserBiography(biography)
        await this.httpService.updateBiography(biography)
        this.toast.showToast('Biography updated')
    }

    private async addImage(base64Image: any, myId: any) {
        await this.storageService.addPortfolioPicture(base64Image, myId)
        this.userImages.push({ image: base64Image, uuid: myId })
    }

    private async removeImage(id: any) {
        const alert = await this.alertController.create({
            header: 'Remove Image?',
            message: '<p>Would you like to remove this protfolio image from <i color="primary">Maven?</i></p>',
            buttons: [
                {
                    text: 'Never Mind',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    text: 'Remove Image',
                    handler: async () => {
                        this.storageService.removePortfolioPicture(id)
                        const result = this.userImages.filter((e: any) => e.uuid !== id)
                        this.userImages = result
                        await this.httpService.removePortfolioImageById(id)
                    }
                }
            ]
        })

        await alert.present()
    }


    private addTag(tag) {
        this.userTags.push(tag)
    }

    private removeTag(tagToDelete: any) {
        const filtered = this.userTags.filter(tag => tag !== tagToDelete)
        this.userTags = filtered
    }

    private goBack() {
        console.log(this.accountType)
        if (this.accountType === 'influencer' || this.accountType === 'Job Seeker') this.navCtrl.navigateBack('/job-seeker')
        else this.navCtrl.navigateBack('/business-owner')
    }
}
