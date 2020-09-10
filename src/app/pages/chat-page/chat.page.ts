import { Component, NgZone, ChangeDetectorRef } from '@angular/core'
import { NavController, MenuController, AlertController, ModalController, Platform } from '@ionic/angular'
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
import { UserAccount } from 'src/app/models/account'

@Component({
    selector: 'chat-page',
    templateUrl: 'chat.page.html',
    styleUrls: ['chat.page.scss'],
})

export class ChatPage {
    private profilePhoto = '../../assets/img/maven-black.jpg'
    private blankUser = '../../assets/img/maven-black.jpg'
    private dataLoadedSearch = false
    private searchStarted = false
    private unreadMail = false
    private unreadMailLoaded = false
    private recentConversationsLoaded = false
    private setPrivatePhoto = false
    private setPhoto: any
    private accountType: any
    public items: any = []
    public userName: any
    public userEmail: any
    public userList: UserAccount[]
    public unreadMailList: UserAccount[] = []
    public tempList: UserAccount[]

    private refreshInterval: any

    public socketConnecting = false
    public socketConnected = false

    public searchActive = false
    public recentConversations = false
    public recentConversationList: UserAccount[] = []

    public canShow: any

    private subscription: Subscription
    private chatSub: Subscription

    constructor(
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

    }

    private setEmail(email: any) {
    }

    ionViewWillLeave() {

    }

    ionViewDidEnter() {
    }

    async ionViewWillEnter() {
        this.dataLoadedSearch = false
        this.recentConversationsLoaded = false

        const accountType = await this.storageService.getAccountType()
        const userName = await this.storageService.getUserName()
        const userEmail = await this.storageService.getUserEmail()
        const recentConversations = await this.storageService.getRecentCoversationsFullUser()

        const unreadMail = await this.storageService.getRecentUnreadMail()
        const profileImage = await this.storageService.getProfilePicture()
        const token = await this.storageService.getToken()

        this.accountType = accountType
        this.userName = userName
        this.userEmail = userEmail

        let connected = await this.storageService.getConnectionStatus()

        if (connected) this.socketConnected = true
        else this.socketConnecting = true

        if (profileImage) this.profilePhoto = profileImage

        else {
            await this.httpService.getAccount({ token })

            const photo = await this.storageService.getProfilePicture()

            this.profilePhoto = photo
        }

        if (unreadMail === null || unreadMail.length === 0) {
            this.unreadMailLoaded = true
        }

        this.recentConversationList = []
        this.unreadMailList = []

        if (recentConversations !== null && recentConversations !== undefined) {
            this.recentConversationList = recentConversations
            this.recentConversations = true
            this.recentConversationsLoaded = true
            for (let i = 0; i < this.recentConversationList.length; i++) {
                this.httpService.searchUsers(token, this.recentConversationList[i]['userName'], accountType).then(async (userList: UserAccount[]) => {
                    if (userList[0].email === this.recentConversationList[i]['email']) this.recentConversationList[i]['online'] === userList[0].online
                }).catch(err => {
                    console.log(err)
                    this.recentConversationsLoaded = true
                    this.toast.showToast(err)
                })
            }
        }

        else this.recentConversationsLoaded = true

        if (!unreadMail) return this.unreadMailLoaded = true

        unreadMail.forEach(async element => {
            if (element !== null && element !== undefined) {
                this.unreadMail = true

                let token = await this.storageService.getToken()

                this.httpService.searchUsersByEmail(token, element).then(async (userList: UserAccount[]) => {
                    if (userList.length === undefined) return
                    if (userList.length === 0 || userList[0].email !== this.userEmail) this.unreadMailList.push(userList[0])
                    this.unreadMailLoaded = true
                }).catch(err => {
                    this.toast.showToast('Error loading unread mail. Try again later.')
                    this.unreadMailLoaded = true
                })
            }
        })
    }

    private async clearUnreadMail(email: any) {
        const token = await this.storageService.getToken()
        const name = await this.httpService.getUserNameByEmail(token, email)
        this.storageService.addToRecentConversations(name)
        this.storageService.removeFromUnreadMail(email)
    }

    private capitalizeName(accountType) {
        return accountType.charAt(0).toUpperCase() + accountType.slice(1)
    }

    private goBack() {
        if (this.accountType === 'influencer') this.navCtrl.navigateBack('/job-seeker')
        else this.navCtrl.navigateBack('/business-owner')
    }

    private async goToIndividualChat(email: string) {
        this.storageService.setTargetedChatUser(email)
        this.setRecentConversations(this.userEmail)
        this.navCtrl.navigateForward('/individual-chat')
    }

    filterItems(searchTerm: any) {
        return this.items.filter(item => {
            return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        })
    }

    private async setRecentConversations(email) {
        console.log('starting userlist set ' + email)
        let isInList = false
        const token = await this.storageService.getToken()
        const recent = await this.storageService.getRecentCoversationsFullUser()

        console.log(recent)

        if (recent) {
            recent.forEach(element => {
                if (element['email'] === email) isInList = true
            })
        }

        if (isInList) return

        await this.httpService.searchUsersByEmail(token, email).then(async (userList: UserAccount[]) => {
            console.log('this is userlist 0')
            console.log(userList)
            if (userList.length === undefined) return
            console.log('this is userlist 0')
            console.log(userList[0])
            if (userList.length === 0 || userList[0].email !== this.userEmail) this.storageService.setRecentConversationsFullUser([userList[0]])
        }).catch(err => {
            this.toast.showToast('Error loading unread mail. Try again later.')
            this.unreadMailLoaded = true
        })
        this.recentConversations = true
    }

    async searchForUser(user: String) {
        this.dataLoadedSearch = false
        this.searchStarted = true
        //this.userList = []
        this.searchActive = true

        if (user === '') {
            this.searchActive = false
            this.dataLoadedSearch = true
            this.searchStarted = false
            return this.userList = []
        }

        const tokenTime = await this.storageService.getTokenTime()
        const accountType = await this.storageService.getAccountType()

        const start = moment(tokenTime)
        const minutesPassed = moment().diff(start, 'minutes')

        let token

        if (minutesPassed < 4) token = await this.storageService.getToken()
        else token = await this.httpService.refreshToken()

        this.httpService.searchUsers(token, user, accountType).then(async (userList: UserAccount[]) => {
            console.log(userList)
            let finalList = []

            userList.forEach(element => {
                if (element.email !== this.userEmail) finalList.push(element)
            })

            this.userList = finalList

            this.dataLoadedSearch = true
            this.searchStarted = false

        }).catch(err => {
            this.toast.showToast('Unable to communicate with Maven servers. Please try again later.')
        })
    }

    public async userActive(time: any) {
        const start = moment(time)
        const minutesPassed = moment().diff(start, 'minutes')

        if (minutesPassed > 4) return false
        else return true
    }

    private removeFromList(userName: String) {
        this.storageService.removeFromRecentConversations(userName)
        this.recentConversationList = this.recentConversationList.filter(user => user.userName !== userName)
    }

    private removeElement(array: any[], elem: any) {
        var index = array.indexOf(elem)
        if (index > -1) {
            array.splice(index, 1)
        }
    }

    private fixDate(date: any) {
        return moment(date).calendar()
    }

    private checkOnlineStatus() {
        return new Promise((resolve, reject) => {
            if (this.network.online()) resolve(true)
            else resolve(false)
        })
    }
}
