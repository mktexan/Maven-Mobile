import { Component, NgZone, ChangeDetectorRef } from '@angular/core'
import { NavController, MenuController, AlertController, ModalController } from '@ionic/angular'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import {
    AuthService, NetworkService, HttpService,
    SocketService, MessageService, LoadingService,
    ToastService, StorageService
} from '../../services'
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx'
import * as moment from 'moment'
import { Subscription } from 'rxjs'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'

@Component({
    selector: 'tags',
    templateUrl: 'tags.page.html',
    styleUrls: ['tags.page.scss'],
})

export class TagsPage {
    private profilePhoto = '../../assets/img/profile.png'
    private userBiography = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    private accountType: any
    private profilePicture: any
    public userName: any
    public userEmail: any
    private userTags: any

    public isBusiness = false
    public isInfluencer = false

    form: FormGroup

    constructor(
        private formBuilder: FormBuilder,
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
        const tags = await this.httpService.getTags()
        this.userTags = tags
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

    private async addTag(tag: any) {
        this.userTags.push(tag)
        await this.httpService.addTags(tag, this.accountType)
    }

    private async removeTag(tagToDelete: any) {
        const filtered = this.userTags.filter(tag => tag !== tagToDelete)
        await this.httpService.removeTag(tagToDelete)
        this.userTags = filtered
    }

    private goBack() {
        if (this.accountType === 'influencer') this.navCtrl.navigateBack('/job-seeker')
        else this.navCtrl.navigateBack('/business-owner')
    }
}
