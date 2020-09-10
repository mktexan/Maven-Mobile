import { Component, NgZone, ChangeDetectorRef } from '@angular/core'
import { NavController, MenuController, AlertController, ModalController } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import {
    AuthService, NetworkService, HttpService,
    SocketService, MessageService, LoadingService,
    ToastService, StorageService
} from '../../services'
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx'
import * as moment from 'moment'
import { Subscription } from 'rxjs'

@Component({
    selector: 'subscription',
    templateUrl: 'subscription.page.html',
    styleUrls: ['subscription.page.scss'],
})

export class SubscriptionPage {
    private profilePhoto = '../../assets/img/profile.png'
    private userBiography = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    private accountType: any
    private profilePicture: any
    public userName: any
    public userEmail: any

    public isBusiness = false
    public isInfluencer = false

    constructor(
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

    ionViewDidEnter() {
    }

    async ionViewWillEnter() {
        const accountType = await this.storageService.getAccountType()
        const email = await this.storageService.getUserEmail()
        const name = await this.storageService.getUserName()
        const profileImage = await this.storageService.getProfilePicture()

        if (profileImage) this.profilePicture = profileImage

        if (accountType === 'business') this.isBusiness = true
        else this.isInfluencer = true


        this.userEmail = email
        this.userName = name
        this.accountType = accountType
    }

    private goBack() {
        if (this.accountType === 'influencer') this.navCtrl.navigateBack('/job-seeker')
        else this.navCtrl.navigateBack('/business-owner')
    }
}
