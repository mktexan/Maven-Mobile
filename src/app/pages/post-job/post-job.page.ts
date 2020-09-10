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

declare let google: any

@Component({
    selector: 'post-job',
    templateUrl: 'post-job.page.html',
    styleUrls: ['post-job.page.scss'],
})

export class PostJobPage {
    public userName: any
    public userEmail: any
    public jobCardComplete = false
    public previewingForm = false
    public showSearchBar = true
    public currencyValue: any
    private geoCoder: any
    private jobDescription: any
    private tags: any
    private jobLocation: any
    private jobTitle: any
    private jobPay: any
    private address: any
    public matches = []
    private userTags = []
    public selectedTags = ''
    public loadingMatches = false

    @ViewChild('search')
    public searchElementRef: ElementRef

    // REFACTOR TO SAVE ON ACCOUNT CREATE AND GET FROM STORAGE
    private companyName = this.userName

    public jobForm: FormGroup

    constructor(
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
        this.jobForm = this.formBuilder.group({
            jobTitle: ['', Validators.compose([

            ])],
            jobDescription: ['', Validators.compose([

            ])],
            // tags: ['', Validators.compose([

            // ])],
            jobLocation: ['', Validators.compose([

            ])],
            jobPay: ['', Validators.compose([

            ])]
        })
    }

    private setEmail(email: any) {
    }

    ionViewWillLeave() {
    }

    ionViewDidEnter() {

    }

    private removeTag(tagToDelete: any) {
        const filtered = this.userTags.filter(tag => tag !== tagToDelete)
        this.userTags = filtered
    }

    private addTag(tag) {
        this.userTags.push(tag)
    }

    async ionViewWillEnter() {
        const email = await this.storageService.getUserEmail()
        const name = await this.storageService.getUserName()

        this.userEmail = email
        this.userName = name
    }

    // convenience getter for easy access to form fields
    get f() { return this.jobForm.controls }

    private goBack() {
        this.navCtrl.navigateBack('/business-owner')
    }

    private editJob() {
        this.previewingForm = false
        this.jobCardComplete = false
    }

    private customTags() {
        this.showSearchBar = true
    }

    private myTagsList() {
        this.showSearchBar = false
    }

    private async submitJob() {
        await this.httpService.postJob(this.userTags, this.jobTitle, this.jobDescription, this.jobLocation, this.jobPay, this.userName)

        const alert = await this.alertController.create({
            header: 'Job Posting',
            message: 'Your job was successfully posted and will be active for 30 days. You can now view it under the My Jobs page.',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {

                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        this.navCtrl.navigateBack('/business-owner')
                    }
                }
            ]
        })
        
        await alert.present()
    }

    private searchTagList(keyword: any) {
        if (keyword === '') return this.matches = []
        this.matches = []
        this.loadingMatches = true

        this.httpService.searchTagList(keyword).then(async (tag: any) => {
            this.loadingMatches = false
            tag.forEach(element => {
                const tagIncluded = this.matches.includes(element.tag)
                if (!tagIncluded)
                    this.matches.push('#' + element.tag)
            })
        }).catch(err => {
            this.toast.showToast('Unable to communicate with Maven servers. Please try again later.')
        })
    }

    private selectItem(item: any) {
        console.log(item)
        this.matches = []
        this.selectedTags += item + ' '
    }

    private formatCurrency(value: any) {
        value = Number(value['detail']['value'])
        if (isNaN(value)) return
        console.log('$' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
        this.currencyValue = '$' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        return '$' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    private previewJob() {
        this.jobCardComplete = true
        this.previewingForm = true
        this.jobPay = this.jobForm.value['jobPay']
        this.jobDescription = this.jobForm.value['jobDescription']
        this.jobTitle = this.jobForm.value['jobTitle']
        this.jobLocation = this.jobForm.value['jobLocation']
        let tags = []

        console.log(this.jobForm.value['jobPay'])

        tags.push(this.jobForm.value['tags'])

        this.tags = tags
    }
}
