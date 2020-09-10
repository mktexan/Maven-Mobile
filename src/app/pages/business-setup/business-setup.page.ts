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
    selector: 'business-setup',
    templateUrl: 'business-setup.page.html',
    styleUrls: ['business-setup.page.scss'],
})

export class BusinessSetupPage {
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

    }

    private goBack() {

    }
}
