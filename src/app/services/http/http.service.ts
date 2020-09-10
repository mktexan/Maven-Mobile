import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http'
import { Storage } from '@ionic/storage'
import { NavController } from '@ionic/angular'
import { map, catchError } from 'rxjs/operators'
import { throwError } from 'rxjs'
import { AuthService } from '../../services/auth/auth.service'
import { StorageService } from '../../services/storage/storage.service'
import { environment } from '../../../environments/environment'
import { Token } from 'src/app/models/token'
import { AccountType } from 'src/app/models/accountType'
import { UserAccount } from 'src/app/models/account'
import { ChatMessage } from 'src/app/models/chat-message'
import { UserName } from 'src/app/models/userName'
import { NetworkService } from '../../services/network/network.service'
import { ToastService } from '../../services/toast/toast.service'
import { Job } from 'src/app/models/job'
import { Tags } from 'src/app/models/tags'

@Injectable({
    providedIn: 'root'
})

export class HttpService {
    public token = environment.webToken
    public url = environment.baseUrl
    public authUrl = environment.auth
    public accountTypeUrl = environment.getAccountTypeUrl
    public accountUrl = environment.getAccountUrl
    public modifyUserAccountTypeUrl = environment.modifyAccountType
    public registerUrl = environment.register
    public getUserNameByEmailUrl = environment.getUserNameByEmail
    public sendChatMessageUrl = environment.sendChatMessage
    public searchUsersUrl = environment.searchUsers
    public searchUsersByEmailUrl = environment.searchUsersByEmail
    public getLatestChatsByUserUrl = environment.getLatestChatsByUser
    public tokenUrl = environment.getToken
    public resetPasswordUrl = environment.resetPassword
    public saveProfilePictureUrl = environment.saveProfilePicture
    public postJobUrl = environment.postJob
    public getMyJobsUrl = environment.getMyJobs
    public deleteJobUrl = environment.deleteJob
    public deleteAccountUrl = environment.deleteAccount
    public searchTagListUrl = environment.searchTagList
    private getTagsUrl = environment.getTags
    private addTagsUrl = environment.addTags
    private removeTagUrl = environment.removeTag
    private searchJobListUrl = environment.searchJobList
    private addPortfolioImageUrl = environment.addPortfolioImage
    private removePortfolioImageByIdUrl = environment.removePortfolioImageById
    private updateBiographyUrl = environment.updateBiography
    private getBiographyUrl = environment.getBiography
    private getPortfolioImagesUrl = environment.getPortfolioImages
    private getUserOnlineStatusUrl = environment.getUserOnlineStatus

    constructor(
        public toast: ToastService,
        public network: NetworkService,
        private storage: Storage,
        public navCtrl: NavController,
        private storageService: StorageService,
        private auth: AuthService,
        private httpClient: HttpClient,
    ) {
    }

    public tokenRefreshed: boolean

    public register(email: any, password: any, userName: any, uuid: any, oneSignalPushToken: any, oneSignalUserId: any) {
        return new Promise((resolve, reject) => {
            const payload = {
                email: email, password: password, userName: userName,
                uuid: uuid, oneSignalPushToken: oneSignalPushToken, oneSignalUserId: oneSignalUserId
            }

            this.httpClient.post(this.url + this.authUrl + this.registerUrl, payload)
                .pipe(
                    map(async (token: Token) => {
                        await this.storageService.setToken(token.token)
                        await this.storageService.setUserPassword(password)
                        await this.storageService.setTokenExpiration(new Date())
                        resolve(token)
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()
                        if (!isOnline) return reject(err)
                        // else return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }

    public async modifyUserAccountType(accountType: any) {
        return new Promise(async (resolve, reject) => {
            const tokenTime = await this.storageService.getTokenTime()
            const date = new Date()
            const diff = this.diff_minutes(date, tokenTime)

            if (diff > 5) await this.refreshToken()

            const token = await this.storageService.getToken()

            const payload = { token: token, accountType: accountType }

            await this.storageService.setAccountType(accountType)

            this.httpClient.put(this.url + this.authUrl + this.modifyUserAccountTypeUrl, payload)
                .pipe(
                    map((data: any) => {
                        resolve()
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        // if (!refreshed) return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }

    public async login(email: any, password: any) {
        return new Promise((resolve, reject) => {
            const payload = { "email": email, 'password': password }

            this.httpClient.post(this.url + this.authUrl + this.tokenUrl, payload)
                .pipe(
                    map(async (token: Token) => {
                        await this.storageService.setToken(token.token)
                        await this.storageService.setTokenExpiration(new Date())
                        resolve(token)
                    }),
                    catchError(async err => {
                        reject(err)
                    })
                ).subscribe()
        })
    }

    public async getToken(email: any, password: any) {
        console.log('calling get token')
        return new Promise((resolve, reject) => {
            const payload = { "email": email, 'password': password }

            this.httpClient.post(this.url + this.authUrl + this.tokenUrl, payload)
                .pipe(
                    map(async (token: Token) => {
                        await this.storageService.setToken(token.token)
                        await this.storageService.setTokenExpiration(new Date())
                        resolve(token.token)
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()
                        reject(err)
                        // CHECK TO SEE IF THIS IS WHY THE USER KEEPS GETTING LOGGED OUT
                        this.navigateLogin()
                    })
                ).subscribe()
        })
    }

    public async refreshToken() {
        console.log('calling refresh token')
        return new Promise(async (resolve, reject) => {
            const password = await this.storageService.getPassword()
            const email = await this.storageService.getUserEmail()
            const payload = { "email": email, 'password': password }

            this.httpClient.post(this.url + this.authUrl + this.tokenUrl, payload)
                .pipe(
                    map(async (token: Token) => {
                        await this.storageService.setToken(token.token)
                        await this.storageService.setTokenExpiration(new Date())
                        this.tokenRefreshed = true
                        resolve(token.token)
                    }),
                    catchError(err => {
                        // CHECK TO SEE IF THIS IS WHY THE USER KEEPS GETTING LOGGED OUT
                        // this.navigateLogin()
                        return throwError(err)
                    })
                ).subscribe()
        })
    }

    public async tokenRetry() {
        return new Promise(async (resolve, reject) => {
            const password = await this.storageService.getPassword()
            const email = await this.storageService.getUserEmail()
            const payload = { "email": email, 'password': password }

            this.httpClient.post(this.url + this.authUrl + this.tokenUrl, payload)
                .pipe(
                    map(async (token: Token) => {
                        await this.storageService.setToken(token.token)
                        await this.storageService.setTokenExpiration(new Date())
                        this.tokenRefreshed = true
                        resolve(true)
                    }),
                    catchError(err => {
                        this.tokenRefreshed = false
                        resolve(false)
                        return throwError(err)
                    })
                ).subscribe()
        })
    }


    public async getAccountType(token: any) {
        return new Promise(async (resolve, reject) => {
            const payload = { token }

            this.httpClient.post(this.url + this.authUrl + this.accountTypeUrl, payload)
                .pipe(
                    map(async (accountType: AccountType) => {
                        await this.storageService.setAccountType(accountType.accountType)
                        resolve(accountType.accountType)
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        // if (!refreshed) return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }

    public async getAccount(token: any) {
        return new Promise(async (resolve, reject) => {
            const payload = { token }

            this.httpClient.post(this.url + this.authUrl + this.accountUrl, payload)
                .pipe(
                    map(async (account: UserAccount) => {
                        await this.storageService.setUserName(account.userName)
                        await this.storageService.setAccountType(account.accountType)
                        await this.storageService.setProfilePicture(account.profilePicture)
                        return resolve(account)
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        reject(err)
                        // if (!refreshed) return this.navCtrl.navigateRoot(''/login)
                    })
                ).subscribe()
        })
    }

    public async getUserNameByEmail(token: any, email: any) {
        return new Promise(async (resolve, reject) => {
            const payload = { token, email }

            this.httpClient.post(this.url + this.authUrl + this.getUserNameByEmailUrl, payload)
                .pipe(
                    map((userName: UserName) => {
                        return resolve(userName.userName)
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        reject(err)
                        // if (!refreshed) return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }
    public async searchUsers(token: any, userName: String, accountType: String) {
        return new Promise(async (resolve, reject) => {
            const payload = { token, userName, accountType }

            this.httpClient.post(this.url + this.authUrl + this.searchUsersUrl, payload)
                .pipe(
                    map((res: UserAccount[]) => {
                        resolve(res)
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        reject(err)
                        // if (!refreshed) return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }

    public async searchUsersByEmail(token: any, email: String) {
        return new Promise(async (resolve, reject) => {
            const payload = { token, email }

            this.httpClient.post(this.url + this.authUrl + this.searchUsersByEmailUrl, payload)
                .pipe(
                    map((res: UserAccount[]) => {
                        resolve(res)
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        reject(err)
                        // if (!refreshed) return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }


    public async resetPassword(email: String) {
        return new Promise((resolve, reject) => {
            const payload = { email: email }
            this.httpClient.post(this.url + this.authUrl + this.resetPasswordUrl, payload, {
                responseType: 'text'
            })
                .pipe(
                    map((response: any) => {
                        resolve()
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        reject(err)
                        // if (!refreshed) return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }

    public async sendChatMessage(message: any) {
        return new Promise((resolve, reject) => {
            this.httpClient.post(this.url + this.authUrl + this.sendChatMessageUrl, message, {
                responseType: 'text'
            })
                .pipe(
                    map((response: any) => {
                        resolve()
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        reject(err)
                        // if (!refreshed) return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }

    public async postJob(tags: any, title: any, description: any, location: any, pay: any, companyName: any) {
        const token = await this.storageService.getToken()
        const email = await this.storageService.getUserEmail()
        const message = { token, email, tags, title, description, location, pay, companyName }
        return new Promise((resolve, reject) => {
            this.httpClient.post(this.url + this.authUrl + this.postJobUrl, message, {
                responseType: 'text'
            })
                .pipe(
                    map((response: any) => {
                        resolve()
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        reject(err)
                        // if (!refreshed) return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }

    public async getMyJobs() {
        const token = await this.storageService.getToken()
        const headers = new HttpHeaders({ 'authorization': token })
        return new Promise((resolve, reject) => {
            this.httpClient.get(this.url + this.authUrl + this.getMyJobsUrl, { headers }).subscribe((res: Job[]) => {
                resolve(res)
            })
        })
    }

    public async addTags(tag: any, accountType: any) {
        const token = await this.storageService.getToken()
        const body = { tag, accountType, token }
        return new Promise((resolve, reject) => {
            this.httpClient.post(this.url + this.authUrl + this.addTagsUrl, body).subscribe((res: any) => {
                resolve(res)
            })
        })
    }

    public async updateBiography(biography: any) {
        const token = await this.storageService.getToken()
        const body = { biography, token }
        return new Promise((resolve, reject) => {
            this.httpClient.put(this.url + this.authUrl + this.updateBiographyUrl, body).subscribe((res: any) => {
                resolve(res)
            })
        })
    }

    public async getTags() {
        const token = await this.storageService.getToken()
        const headers = new HttpHeaders({ 'authorization': token })
        return new Promise((resolve, reject) => {
            this.httpClient.get(this.url + this.authUrl + this.getTagsUrl, { headers }).subscribe((res: Tags) => {
                console.log(res)
                resolve(res)
            })
        })
    }

    public async removeTag(tag: any) {
        const token = await this.storageService.getToken()
        const headers = new HttpHeaders({ 'authorization': token, 'tag': tag })
        return new Promise((resolve, reject) => {
            this.httpClient.delete(this.url + this.authUrl + this.removeTagUrl, { headers }).subscribe((res: Tags) => {
                resolve(res)
            })
        })
    }

    public async getBiography() {
        const token = await this.storageService.getToken()
        const headers = new HttpHeaders({ 'authorization': token })
        return new Promise((resolve, reject) => {
            this.httpClient.get(this.url + this.authUrl + this.getBiographyUrl, { headers, 'responseType': 'json' }).subscribe((res: any) => {
                resolve(res)
            })
        })
    }

    public async getPortfolioImages(email: any) {
        const token = await this.storageService.getToken()
        const headers = new HttpHeaders({ 'authorization': token, 'email': email })
        return new Promise((resolve, reject) => {
            this.httpClient.get(this.url + this.authUrl + this.getPortfolioImagesUrl, { headers, 'responseType': 'json' }).subscribe((res: any) => {
                resolve(res)
            })
        })
    }

    public async deleteJob(id: any) {
        const token = await this.storageService.getToken()
        const headers = new HttpHeaders({ 'authorization': token, 'id': id })
        return new Promise((resolve, reject) => {
            this.httpClient.delete(this.url + this.authUrl + this.deleteJobUrl, { headers }).subscribe((res: any) => {
                resolve(res)
            })
        })
    }

    public async removePortfolioImageById(id: any) {
        const token = await this.storageService.getToken()
        const headers = new HttpHeaders({ 'authorization': token, 'id': id })
        return new Promise((resolve, reject) => {
            this.httpClient.delete(this.url + this.authUrl + this.removePortfolioImageByIdUrl, { headers, 'responseType': 'json' }).subscribe((res: any) => {
                resolve(res)
            })
        })
    }

    public async searchTagList(keyword: any) {
        const token = await this.storageService.getToken()
        const headers = new HttpHeaders({ 'authorization': token, 'keyword': keyword })
        return new Promise((resolve, reject) => {
            this.httpClient.get(this.url + this.authUrl + this.searchTagListUrl, { headers }).subscribe((res: any) => {
                resolve(res)
            })
        })
    }

    public async searchJobList(keyword: any) {
        const token = await this.storageService.getToken()
        const headers = new HttpHeaders({ 'authorization': token, 'keyword': keyword })
        return new Promise((resolve, reject) => {
            this.httpClient.get(this.url + this.authUrl + this.searchJobListUrl, { headers }).subscribe((res: any) => {
                resolve(res)
            })
        })
    }

    public async getUserOnlineStatus(userEmail) {
        const token = await this.storageService.getToken()
        const headers = new HttpHeaders({ 'authorization': token, 'useremail': userEmail })
        return new Promise((resolve, reject) => {
            this.httpClient.get(this.url + this.authUrl + this.getUserOnlineStatusUrl, { headers }).subscribe((res: any) => {
                resolve(res)
            })
        })
    }

    public async deleteAccount(email: any) {
        const token = await this.storageService.getToken()
        const headers = new HttpHeaders({ 'authorization': token, 'email': email })
        return new Promise((resolve, reject) => {
            this.httpClient.delete(this.url + this.authUrl + this.deleteAccountUrl, { headers, 'responseType': 'json' }).subscribe((res: any) => {
                resolve(res)
            })
        })
    }

    public async getLatestChatsByUser(to: any, from: any, token: any) {
        return new Promise((resolve, reject) => {
            const message = { to, from, token }
            this.httpClient.post(this.url + this.authUrl + this.getLatestChatsByUserUrl, message)
                .pipe(
                    map((response: ChatMessage) => {
                        resolve(response)
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        // if (!refreshed) return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }

    public async saveUserProfilePicture(token: any, email: any, image: any) {
        return new Promise((resolve, reject) => {
            const message = { token, email, image }
            this.httpClient.post(this.url + this.authUrl + this.saveProfilePictureUrl, message)
                .pipe(
                    map((response: ChatMessage) => {
                        resolve(response)
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        // if (!refreshed) return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }

    public async addPortfolioImage(token: any, image: any) {
        return new Promise((resolve, reject) => {
            const message = { token, image }
            this.httpClient.post(this.url + this.authUrl + this.addPortfolioImageUrl, message)
                .pipe(
                    map((response: any) => {
                        resolve(response)
                    }),
                    catchError(async err => {
                        const isOnline = await this.checkOnlineStatus()

                        if (!isOnline) {
                            this.toast.showToast('Internet connection error. Check service and try again.')
                            return reject(err)
                        }

                        const refreshed = await this.retryGetToken()
                        // if (!refreshed) return this.navCtrl.navigateRoot('/login')
                    })
                ).subscribe()
        })
    }

    private async retryGetToken() {
        const refreshed = await this.refreshToken()
        if (refreshed) return true
        return false
    }


    public diff_minutes(dt2: Date, dt1: Date) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000
        diff /= 60
        return Math.abs(Math.round(diff))
    }

    private checkOnlineStatus() {
        return new Promise((resolve, reject) => {
            if (this.network.online()) resolve(true)
            else resolve(false)
        })
    }

    private navigateLogin() {
        this.navCtrl.navigateRoot('/login')
    }
}