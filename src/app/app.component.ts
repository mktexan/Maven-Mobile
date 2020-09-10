import { Component, OnDestroy, OnInit, NgZone } from '@angular/core'
import { Router, Event, NavigationEnd } from '@angular/router'
import { Platform, NavController } from '@ionic/angular'
import { AlertController } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { HttpService } from './services/http/http.service'
import { SocketService } from './services/socket/socket.service'
import { StorageService } from './services/storage/storage.service'
import { BackgroundMode } from '@ionic-native/background-mode/ngx'
import { Storage } from '@ionic/storage'
import { DomSanitizer } from '@angular/platform-browser'
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal/ngx'
import { TranslateProvider, AuthService, MessageService } from './services'
import { TranslateService } from '@ngx-translate/core'
import { environment } from '../environments/environment'
import { Pages } from './interfaces/pages'
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx'
import { Subscription, fromEventPattern } from 'rxjs'
import { TokenManagementService } from './services/token-management/token-management.service'
import { NetworkService } from './services/network/network.service'

import BackgroundGeolocation from "cordova-background-geolocation-lt"

import * as moment from 'moment'
import { ChatMessage } from './models/chat-message'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  public photo: any
  public appPages: Array<Pages>
  public refreshInterval: any
  public user: any
  public firstName: any
  private onResumeSubscription: Subscription
  public lastName: any
  public email: any
  public isBusiness = false
  private smallScreen = false
  private largeScreen = false
  public notificationAlreadyReceived = false
  private connectionCheckInterval: any

  private subscription: Subscription
  private subscriptions = new Subscription()

  constructor(
    private ngZone: NgZone,
    private network: NetworkService,
    private tokenManagementService: TokenManagementService,
    private socketService: SocketService,
    private storageService: StorageService,
    public alertController: AlertController,
    private messageService: MessageService,
    public domSanitizer: DomSanitizer,
    private uniqueDeviceID: UniqueDeviceID,
    private oneSignal: OneSignal,
    private httpService: HttpService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateProvider,
    private translateService: TranslateService,
    public storage: Storage,
    public auth: AuthService,
    public navCtrl: NavController,
    private router: Router,
    private backgroundMode: BackgroundMode
  ) {
    this.onResumeSubscription = this.platform.resume.subscribe(() => this.ngZone.run(async () => {
      clearInterval(this.refreshInterval)
      clearInterval(this.connectionCheckInterval)
      const userEmail = await this.storageService.getUserEmail()
      const tokenTime = await this.storageService.getTokenTime()
      const start = moment(tokenTime)
      const minutesPassed = moment().diff(start, 'minutes')

      let token: any

      if (minutesPassed > 4) token = await this.httpService.refreshToken()
      else token = await this.storageService.getToken()

      this.startTokenInterval(userEmail)

      this.socketService.connectSocket(token)
      this.startSocketSubscriptions()
    }))

    this.platform.pause.subscribe(async () => this.ngZone.run(async () => {
      clearInterval(this.refreshInterval)
      clearInterval(this.connectionCheckInterval)
      this.socketService.disconnectSocket()
    }))
  }

  showNotification() {
    this.notificationAlreadyReceived = true
  }

  ngOnDestroy() {
    clearInterval(this.refreshInterval)
    clearInterval(this.connectionCheckInterval)
    this.onResumeSubscription.unsubscribe()
    this.subscriptions.unsubscribe()
  }

  ngOnInit(): void {
    this.initializeApp()
  }

  public startTokenInterval(email) {
    this.refreshInterval = setInterval(async () => {
      const userEmail = await this.storageService.getUserEmail()
      const password = await this.storageService.getPassword()

      if (!userEmail && !password) return

      let token = await this.httpService.refreshToken()

      await this.storageService.setToken(token)
      await this.storageService.setTokenExpiration(new Date())

      this.socketService.sendAliveNotification(email)
      this.socketService.updateSocketTokenUrl(token)
    }, 240000)
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      const userEmail = await this.storageService.getUserEmail()
      const password = await this.storageService.getPassword()

      if (userEmail && password) {
        this.isBusiness = await this.storageService.getAccountType() === 'business'
        this.startTokenInterval(userEmail)
        this.startSocketSubscriptions()
        const token = await this.httpService.getToken(userEmail, password)
        this.socketService.connectSocket(token)
        this.messageService.sendMessage('con')
        this.socketService.sendAliveNotification(userEmail)
      }

      this.storageService.setDeviceHeight(this.platform.height())
      this.storageService.setDeviceWidth(this.platform.width())

      if (this.platform.height() < 700) this.smallScreen = true
      else this.largeScreen = true

      this.oneSignal.startInit(environment.oneSignalAppId, environment.oneSignalMessageSenderId)
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification)
      this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload))
      this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload))
      this.oneSignal.setLocationShared(true)
      this.oneSignal.setSubscription(true)
      this.oneSignal.endInit()

      this.oneSignal.getIds().then(data => {
        this.storageService.setOneSignalId(data.userId)
        this.storageService.setOneSignalPushToken(data.pushToken)
      })

      this.splashScreen.hide()
      this.statusBar.styleDefault()

      // Set language of the app.
      this.translateService.setDefaultLang(environment.language)
      this.translateService.use(environment.language)
      this.translateService.getTranslation(environment.language).subscribe(translations => {
        this.translate.setTranslations(translations)
      })

    }).catch(() => {
      // Set language of the app.
      this.translateService.setDefaultLang(environment.language)
      this.translateService.use(environment.language)
      this.translateService.getTranslation(environment.language).subscribe(translations => {
        this.translate.setTranslations(translations)
      })
    })
  }

  private async startSocketSubscriptions() {
    this.subscriptions.add(
      this.messageService.getMessage().subscribe(async message => {
        if (message.text === 'login') {
          const token = await this.storageService.getToken()
          const userEmail = await this.storageService.getUserEmail()
          const password = await this.storageService.getPassword()
          this.startTokenInterval(userEmail)
          this.socketService.connectSocket(token)
          this.messageService.sendMessage('con')
          this.startSocketSubscriptions()
        }
      }))
    this.subscriptions.add(this.socketService.ping().subscribe(() => {
      this.messageService.sendMessage('ping')
    }))

    this.subscriptions.add(this.socketService.chatMessage().subscribe(async (message: ChatMessage) => {
      this.messageService.sendUserChatMessage(message)
    }))

    this.subscriptions.add(this.socketService.disconnect()
      .subscribe((reason: any) => {
        this.messageService.sendMessage('dc')
      }))

    this.subscriptions.add(this.socketService.connect()
      .subscribe((reason: any) => {
        this.messageService.sendMessage('con')
      }))

    this.subscriptions.add(this.socketService.reconnecting()
      .subscribe((attemptNumber: any) => {
        this.messageService.sendMessage('rc')
      }))

    this.subscriptions.add(this.socketService.connectionError()
      .subscribe((err: any) => {
        this.messageService.sendMessage('err')
      }))

    this.subscriptions.add(this.socketService.aliveResponse()
      .subscribe((status: any) => {
        this.messageService.sendMessage('con')
      }))
  }

  private onPushReceived(payload: OSNotificationPayload) {
  }

  private onPushOpened(payload: OSNotificationPayload) {
    console.log('push notification opened')
    console.log(payload)
  }

  private startConnectionInterval(userEmail: any, password: any) {
    this.connectionCheckInterval = setInterval(async () => {
      if (!userEmail && !password) return

      let connected = await this.storageService.getConnectionStatus()

      if (connected) return

      const online = this.network.online()

      if (!online) return

      const token = await this.httpService.refreshToken()

      console.log('refreshed token from the start connection interval app component')

      if (!token) return

      this.socketService.connectSocket(token)
      this.startSocketSubscriptions()
    }, 5000)
  }


  private goToEditProfile() {
    this.navCtrl.navigateForward('/edit-profile')
  }

  private goToTags() {
    this.navCtrl.navigateForward('/tags')
  }

  logout() {
    this.auth.logout().then(() => {
      this.storage.clear()
      this.navCtrl.navigateRoot('/login')
    })
  }


  private navigateToAboutMe() {
    this.navCtrl.navigateForward('/about-me')
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'This will remove your account!!!',
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

          }
        }
      ]
    })

    await alert.present()
  }
}
