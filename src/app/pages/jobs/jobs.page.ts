import { Component, NgZone, ChangeDetectorRef, OnInit, ViewChild, ElementRef } from '@angular/core'
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';
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
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Job } from 'src/app/models/job';


declare let google: any

@Component({
    selector: 'jobs',
    templateUrl: 'jobs.page.html',
    styleUrls: ['jobs.page.scss'],
})

export class JobsPage {
    public userName: any
    public userEmail: any
    public jobCardComplete = false
    public previewingForm = false
    public currencyValue: any
    public jobsLoaded = false
    private showSearchBar = true
    private showCustomOption = true
    public hasJobs: boolean
    private data = true
    private jobList: any

    @ViewChild('search')
    public searchElementRef: ElementRef

    // REFACTOR TO SAVE ON ACCOUNT CREATE AND GET FROM STORAGE
    private companyName = 'Test Company'

    public jobForm: FormGroup

    constructor(
        private changeRef: ChangeDetectorRef,
        private ngZone: NgZone,
        private mapsApiLoader: MapsAPILoader,
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
        const email = await this.storageService.getUserEmail()
        const name = await this.storageService.getUserName()

        this.userEmail = email
        this.userName = name

        this.jobsLoaded = true

        if (this.jobList.length > 0) this.hasJobs = true
        else this.hasJobs = false
    }

    private fixDate(date: any) {
        return moment(date).calendar()
    }

    private async onKeyPress(tag: any) {
        this.showCustomOption = false

        const tagLength = tag.split('').length

        if (tagLength <= 1) {
            this.jobList = []
            return this.showCustomOption = true
        }

        const jobList = await this.httpService.searchJobList(tag)

        this.jobList = jobList
    }

    private formatCurrency(value: any) {
        value = Number(value)
        if (isNaN(value)) return
        this.currencyValue = '$' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        return '$' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    // convenience getter for easy access to form fields
    get f() { return this.jobForm.controls }

    private goBack() {
        this.navCtrl.navigateBack('/job-seeker')
    }

    private async applyToJob(id: any) {
        const alert = await this.alertController.create({
            header: 'Apply To Job',
            message: 'Are you sure you want to apply to this job?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        setTimeout(() => {

                        }, 1000)
                    }
                }, {
                    text: 'Okay',
                    handler: () => {

                    }
                }
            ]
        })

        await alert.present()
    }

    private customTags() {
        this.showSearchBar = true
        this.data = true
    }

    private myTagsList() {
        this.showSearchBar = false
        this.data = false
        console.log('when users selects this option, auto search all jobs related to their tags')
        console.log('a custom option needs to exist to allow filtering of personal tag related jobs by individual tag')
    }
}
