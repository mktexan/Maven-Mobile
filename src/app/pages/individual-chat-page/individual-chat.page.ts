import { Component, NgZone, ChangeDetectorRef, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { NavController, MenuController, AlertController, ModalController, IonContent, Platform } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import {
    AuthService, NetworkService, HttpService,
    SocketService, MessageService, LoadingService,
    ToastService, StorageService, NotificationService, TokenManagementService,
} from '../../services'
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx'
import * as moment from 'moment'
import { Subscription, Subject } from 'rxjs'
import { UserAccount } from 'src/app/models/account'
import { ChatMessage } from 'src/app/models/chat-message'
import { UserTyping } from 'src/app/models/userTyping'

@Component({
    selector: 'individual-chat',
    templateUrl: 'individual-chat.page.html',
    styleUrls: ['individual-chat.page.scss'],
})

export class IndividualChatPage implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('chatContent') private content: any
    private profilePhoto = '../../assets/img/profile.png'
    private accountType: any
    private targetedUser: any
    private senderInput: any
    private currentUser: String
    public photo: any
    public userEmail: any
    public userName: any
    public userActive = false
    public timer: any
    public timerActive = false
    public refreshInterval: any
    private userTypingTimestamp: any

    public socketConnected = true
    public socketConnecting = false
    private chatLoaded = false
    private userIsTyping = false

    private userTypingInterval: any
    private subscriptions = new Subscription()

    public myId: any

    public messages = []

    private subscription: Subscription
    private chatSub: Subscription
    private typingSub: Subscription

    constructor(
        private ngZone: NgZone,
        private change: ChangeDetectorRef,
        private tokenManagementService: TokenManagementService,
        private notificationService: NotificationService,
        private platform: Platform,
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

        this.platform.pause.subscribe(() => this.ngZone.run(() => {
        }))

        this.platform.resume.subscribe(() => this.ngZone.run(() => {
        }))
    }

    async ngAfterViewInit() {

    }

    async ngOnInit() {
        this.initializePage()
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe()
    }

    private setEmail(email: any) {
    }

    ionViewWillLeave() {
    }

    private async initializePage() {
        console.log('initializing page from ind chat')
        this.startChatSubscription()

        const token = await this.storageService.getToken()

        const accountType = await this.storageService.getAccountType()

        const user = await this.storageService.getUserEmail()

        const userName = await this.storageService.getUserName()

        const chatUser = await this.storageService.getTargetedChatUser()

        const chatUserName = await this.httpService.getUserNameByEmail(token, chatUser)

        this.targetedUser = chatUserName
        this.accountType = accountType
        this.myId = user

        this.httpService.searchUsers(token, chatUserName.toString(), accountType).then(async (userList: UserAccount[]) => {
            if (userList[0].profilePicture) this.profilePhoto = userList[0].profilePicture.toString()
            this.userActive = userList[0].online
        }).catch((err: string) => {
            console.log(err)
            this.toast.showToast(err)
        })

        this.httpService.getLatestChatsByUser(chatUser, user, token).then((data: ChatMessage[]) => {
            data.forEach(async element => {
                let mod = element
                mod.toUserName = this.targetedUser
                mod.fromUserName = userName
                this.messages.push(element)
            })

            this.messages.sort((a, b) => {
                a = new Date(a.time)
                b = new Date(b.time)
                return a < b ? -1 : a > b ? 1 : 0
            })

            this.chatLoaded = true

            setTimeout(() => {
                if (this.content.scrollToBottom) {
                    this.content.scrollToBottom(300)
                }
            }, 200)
        })
    }

    private checkUserTyping() {
        this.userTypingInterval = setInterval(() => {
            let secondBetweenTwoDate = Math.abs((new Date().getTime() - this.userTypingTimestamp.getTime()) / 1000)

            if (secondBetweenTwoDate > 6) {
                this.userIsTyping = false
                clearInterval(this.userTypingInterval)
            }
        }, 2000)
    }

    private clearLocalInterval() {
        clearInterval(this.userTypingInterval)
    }

    private async sendTypingAlert() {
        const receivingUser = await this.storageService.getTargetedChatUser()
        const fromUser = await this.storageService.getUserEmail()
        const data = { receivingUser, fromUser }
        this.socketService.sendUserTyping(data)
    }

    private startChatSubscription() {
        this.subscriptions.add(this.socketService.chatMessage().subscribe(async (message: ChatMessage) => {
            if (!message.from) return

            this.messages.push(message)

            this.userActive = true
            this.userIsTyping = false

            setTimeout(() => {
                if (this.content.scrollToBottom) {
                    this.content.scrollToBottom(700)
                }
            }, 200)
        }))

        this.subscriptions.add(this.socketService.userTyping().subscribe(async (message: UserTyping) => {
            this.clearLocalInterval()
            this.userIsTyping = true
            if (message.user === this.myId) {
                this.userTypingTimestamp = new Date()
                this.userIsTyping = true

                this.userTypingInterval = setInterval(() => {

                    const secondBetweenTwoDate = Math.abs((new Date().getTime() - this.userTypingTimestamp.getTime()) / 1000)

                    if (secondBetweenTwoDate > 1) {
                        this.userIsTyping = false
                        this.clearLocalInterval()
                    }
                }, 500)
            }
        }))

        this.subscriptions.add(this.messageService.getMessage().subscribe(message => {
            if (message.text === "con" || message.text === "sign in" || message.text === "login") this.socketConnected = true
            if (message.text === "ping") this.socketConnected = true
            if (message.text === "dc") this.socketConnected = false
            if (message.text === "rc") {
                this.socketConnected = false
                this.socketConnecting = true
            }
            if (message.text === "err") {
                this.socketConnecting = false
                this.socketConnected = false
            }
        }))
    }


    private goBack() {
        this.navCtrl.navigateBack('chat-page')
    }

    private async sendMessage(message: any) {
        const connected = await this.storageService.getConnectionStatus()
        const tokenTime = await this.storageService.getTokenTime()
        const start = moment(tokenTime)
        const minutesPassed = moment().diff(start, 'minutes')

        let token

        if (minutesPassed < 4) token = await this.storageService.getToken()
        else token = await this.httpService.refreshToken()

        if (!connected) {
            this.socketService.connectSocketTokenUpdated()
            return this.toast.showToast("Server connection error. Try again in a minute.")
        }

        const email = await this.storageService.getUserEmail()
        const chatUser = await this.storageService.getTargetedChatUser()
        const toSend = { text: message, from: email, to: chatUser, time: new Date(), token: token }

        this.socketService.sendChatMessage(toSend)

        let modifiedMessage = { text: message, from: email, to: chatUser, time: new Date(), token: token }

        this.messages.push(modifiedMessage)

        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom(300)
            }
        }, 200)

        this.senderInput = ''

        return
    }

    private fixDate(date: any) {
        return moment(date).calendar()
    }
}
