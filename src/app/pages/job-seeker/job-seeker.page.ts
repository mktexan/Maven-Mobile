import { Component, NgZone, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core'
import { Platform, NavController, MenuController, AlertController, ModalController, IonRouterOutlet, ActionSheetController } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import {
  AuthService, NetworkService, HttpService,
  SocketService, MessageService, LoadingService,
  ToastService, StorageService, TranslateProvider,
  NotificationService, TokenManagementService, CameraService,
  AlertService, GpsService
} from '../../services'
import { trigger, transition, useAnimation } from '@angular/animations'
import { bounce } from 'ng-animate'
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import * as moment from 'moment'
import { Subscription } from 'rxjs'
import { ActionSheetService } from '../../services/action-sheet/action-sheet.service'
import { UserTyping } from 'src/app/models/userTyping'

@Component({
  selector: 'job-seeker',
  templateUrl: 'job-seeker.page.html',
  styleUrls: ['job-seeker.page.scss']
})

export class JobSeekerPage implements OnInit, OnDestroy {
  public profilePicture: any
  public userEmail = "example@example.com"
  public userName: any
  public profilePhoto = '../../assets/img/plus.png'
  public timer: any
  public timerActive = false
  public photo: string

  public socketConnected = false
  private socketConnecting = true
  public hasProfileImage = false

  public instagramActive = false
  public twitterActive = false
  public facebookActive = false
  public snapChatActive = false
  public tikTokActive = false
  public linkedinActive = false
  private unreadMail = false
  private smallScreen = false
  private largeScreen = false
  public aliveInterval: any

  public userList = new Array()

  private subscriptions = new Subscription()

  public lat: any
  public lon: any
  public locality: any

  private userIsTyping = false

  private userTypingInterval: any
  private userTypingTimestamp: any

  lastImage: SafeResourceUrl

  constructor(
    private ngZone: NgZone,
    private gpsService: GpsService,
    private actionSheetService: ActionSheetService,
    private alertService: AlertService,
    private cameraService: CameraService,
    private tokenManagementService: TokenManagementService,
    private notificationService: NotificationService,
    private platform: Platform,
    public asCtrl: ActionSheetController,
    private translate: TranslateProvider,
    private geolocation: Geolocation,
    private storageService: StorageService,
    public modalController: ModalController,
    public alertController: AlertController,
    private toast: ToastService,
    public loading: LoadingService,
    private messageService: MessageService,
    private socketService: SocketService,
    private nativeGeocoder: NativeGeocoder,
    private httpService: HttpService,
    public network: NetworkService,
    public storage: Storage,
    public auth: AuthService,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public domSanitizer: DomSanitizer
  ) {
    this.menuCtrl.enable(true)

    this.platform.resume.subscribe(() => this.ngZone.run(async () => {
      await this.initializePage()
      this.startSubscription()
    }))


    this.platform.pause.subscribe(async () => {
      this.socketConnected = false
    })

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
  async ngOnInit() {
    if (this.platform.height() < 650) this.smallScreen = true
    else this.largeScreen = true

    await this.initializePage()
    await this.startSubscription()
  }

  public setEmail(email: any) {
  }

  async ionViewWillEnter() {
    if (!this.network.online()) this.toast.showToast('No internet connection. Page data can not sync with Maven servers. Please connect to the internet and try again.')
  }

  private async getPosition() {
    const positionData = await this.gpsService.getPosition()
    this.lat = positionData['lat']
    this.lon = positionData['lon']
    this.locality = positionData['locality']
  }

  private async initializePage() {
    this.getPosition()

    const profileImage = await this.storageService.getProfilePicture()

    this.profilePicture = profileImage
    this.userEmail = await this.storageService.getUserEmail()
    this.userName = await this.storageService.getUserName()

    const token = await this.storageService.getToken()

    if (profileImage) {
      this.hasProfileImage = true
      this.lastImage = profileImage
      this.profilePicture = profileImage
    } else {
      await this.httpService.getAccount({ token })

      this.profilePicture = await this.storageService.getProfilePicture()
    }

    let connected = await this.storageService.getConnectionStatus()

    if (connected) this.socketConnected = true
    else this.socketConnecting = true
  }

  async setPhoto() {
    await this.cameraService.setPhoto()

    const pic = await this.storageService.getProfilePicture()

    this.profilePicture = this.domSanitizer.bypassSecurityTrustUrl(pic)
  }

  private async deleteAccount() {
    const email = await this.storageService.getUserEmail()
    await this.httpService.deleteAccount(email)
    this.storage.clear()
    this.navCtrl.navigateRoot('/login')
  }

  async goToSettings() {
    const choice = await this.actionSheetService.goToSettings()
    if (choice === 'subscription') ''
    if (choice === "delete") this.deleteAccount()
    if (choice === "reset") this.forgotPass()
  }

  async deleteAccountAlert() {
    const deleteAct = await this.alertService.deleteAccountAlert()
    if (deleteAct) await this.deleteAccount()
  }

  async presentModal() {
    this.unreadMail = false
    this.navCtrl.navigateForward('/chat-page')
  }
  
  private async startSubscription() {
    this.socketService.sendAliveNotification(this.userEmail)

    this.subscriptions.add(this.messageService.getMessage().subscribe(async message => {
      if (message.text === "con") {
        this.socketConnected = true
        this.socketConnecting = false
      }
      if (message === "ping") this.socketConnected = true
      if (message.text === "dc") this.socketConnected = false
      if (message.text === "rc") {
        this.socketConnected = false
        this.socketConnecting = true
      }
      if (message === "err") {
        this.socketConnecting = false
        this.socketConnected = false
        await this.tokenManagementService.checkAndUpdateTokenSocket()
      }
      if (!message.from) return
      this.unreadMail = true
      this.socketConnected = true
      this.notificationService.notifyMessageReceived(message.fromUserName, message.text)
      this.storageService.addToUnreadMail(message.from)
    }))

    this.subscriptions.add(this.socketService.userTyping().subscribe(async (message: UserTyping) => {
      this.clearLocalInterval()
      this.userIsTyping = true
      if (message.user === this.userEmail) {
        this.userTypingTimestamp = new Date()
        this.userIsTyping = true
        this.userTypingInterval = setInterval(() => {

          const secondBetweenTwoDate = Math.abs((new Date().getTime() - this.userTypingTimestamp.getTime()) / 1000)

          if (secondBetweenTwoDate > 2) {
            this.userIsTyping = false
            this.clearLocalInterval()
          }
        }, 500)
      }
    }))
  }

  private clearLocalInterval() {
    clearInterval(this.userTypingInterval)
  }

  private async forgotPass() {
    await this.alertService.forgotPass(this.userEmail)
  }

  async linkTwitter() {
    await this.alertService.linkTwitter()
  }

  async linkSnapChat() {
    await this.alertService.linkSnapChat()
  }

  async linkLinkedin() {
    await this.alertService.linkLinkedin()
  }

  async linkFacebook() {
    await this.alertService.linkFacebook()
  }

  async linkInstagram() {
    await this.alertService.linkInstagram()
  }

  goToAboutMe() {
    this.navCtrl.navigateForward('/about-me')
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('/edit-profile')
  }

  goToJobs() {
    this.navCtrl.navigateForward('/jobs')
  }

  goToTags() {
    this.navCtrl.navigateForward('/tags')
  }
}
