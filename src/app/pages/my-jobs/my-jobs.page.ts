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
    selector: 'my-jobs',
    templateUrl: 'my-jobs.page.html',
    styleUrls: ['my-jobs.page.scss'],
})

export class MyJobsPage {
    public userName: any
    public userEmail: any
    public jobCardComplete = false
    public previewingForm = false
    public currencyValue: any
    public jobsLoaded = false
    public hasJobs: boolean
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

        this.jobList = await this.httpService.getMyJobs()

        this.jobsLoaded = true

        if (this.jobList.length > 0) this.hasJobs = true
        else this.hasJobs = false
    }

    private fixDate(date: any) {
        return moment(date).calendar()
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
        this.navCtrl.navigateBack('/business-owner')
    }

    private async deleteJob(id: any) {
        const alert = await this.alertController.create({
            header: 'Delete Job',
            message: 'Are you sure you want to delete your job posting? You will be unable to undo this action.',
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
                        let myTag = document.getElementById(id)// you can select html element by getelementsByClassName also, please use as per your requirement.
                        myTag.classList.add('slideOutRight')

                        let tempList = []

                        setTimeout(() => {
                            this.jobList.forEach(element => {
                                console.log(element)
                                if (element._id !== id) tempList.push(element)
                            })
                            this.jobList = tempList
                            this.httpService.deleteJob(id)
                        }, 1000)
                    }
                }
            ]
        })

        await alert.present()
    }
}
