import { Component, NgZone, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core'
import { NavController, MenuController, AlertController, ModalController, IonRouterOutlet, ActionSheetController, Platform } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import {
  AuthService, NetworkService, HttpService,
  SocketService, MessageService, LoadingService,
  ToastService, StorageService, TranslateProvider,
  NotificationService, TokenManagementService, CameraService,
  AlertService, GpsService
} from '../../services'

import * as moment from 'moment'
import { Subscription } from 'rxjs'
import { ActionSheetService } from 'src/app/services/action-sheet/action-sheet.service'
import { UserTyping } from 'src/app/models/userTyping'

@Component({
  selector: 'business-owner',
  templateUrl: 'business-owner.page.html',
  styleUrls: ['business-owner.page.scss']
})

export class BusinessOwnerPage implements OnInit, OnDestroy {
  public profilePicture: any
  public userEmail = "example@example.com"
  public userName: any
  public profilePhoto = '../../assets/img/maven-black.jpg'
  public profilePhotoTwo = '../../assets/img/maven-black.jpg'
  public timer: any
  public timerActive = false
  private hasProfileImage = false

  public socketConnected = false
  public socketConnecting = false
  public unreadMail = false

  public refreshInterval: any
  public aliveInterval: any

  private largeScreen = false
  private smallScreen = false

  public instagramActive = false
  public twitterActive = false
  public facebookActive = false
  private userIsTyping = false

  private userTypingInterval: any
  private userTypingTimestamp: any

  private subscriptions = new Subscription()

  public userList = new Array()

  public lat: any
  public lon: any
  public locality: any

  lastImage: SafeResourceUrl

  constructor(
    private ngZone: NgZone,
    private socketService: SocketService,
    private gpsService: GpsService,
    private alertService: AlertService,
    private actionSheetService: ActionSheetService,
    private cameraService: CameraService,
    private tokenManagementService: TokenManagementService,
    public actionSheetController: ActionSheetController,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    public asCtrl: ActionSheetController,
    private storageService: StorageService,
    public modalController: ModalController,
    public alertController: AlertController,
    private toast: ToastService,
    public loading: LoadingService,
    private messageService: MessageService,
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
      clearInterval(this.refreshInterval)
      this.socketConnected = false
    })
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshInterval)
    this.subscriptions.unsubscribe()
  }

  async ngOnInit() {
    if (this.platform.height() < 650) this.smallScreen = true
    else this.largeScreen = true

    await this.initializePage()
    this.startSubscription()
  }

  private startSubscription() {
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
      console.log('user typing')
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

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,0,0,0) 0%), url(${image})`)
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

    const connected = await this.storageService.getConnectionStatus()

    if (connected) this.socketConnected = true
    else this.socketConnecting = true
  }

  async presentModal() {
    this.unreadMail = false
    this.navCtrl.navigateForward('/chat-page')
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

  private async getPosition() {
    const positionData = await this.gpsService.getPosition()
    this.lat = positionData['lat']
    this.lon = positionData['lon']
    this.locality = positionData['locality']
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

  private async forgotPass() {
    await this.alertService.forgotPass(this.userEmail)
  }

  private goToAboutMe() {
    this.navCtrl.navigateForward('/about-me')
  }

  private goToEditProgile() {
    this.navCtrl.navigateForward('/edit-profile')
  }

  private goToTags() {
    this.navCtrl.navigateForward('/tags')
  }

  private goToJobListings() {
    this.navCtrl.navigateForward('/job-listings')
  }

  private goToPostJob() {
    this.navCtrl.navigateForward('/post-job')
  }

  private goToMyJobs() {
    this.navCtrl.navigateForward('/my-jobs')
  }

  async setPhoto() {
    await this.cameraService.setPhoto()

    const pic = await this.storageService.getProfilePicture()

    this.profilePicture = this.domSanitizer.bypassSecurityTrustUrl(pic)
  }
}

