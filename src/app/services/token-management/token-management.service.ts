import { StorageService } from '../../services/storage/storage.service'
import { HttpService } from '../../services/http/http.service'
import * as moment from 'moment'
import { Injectable } from '@angular/core'
import { SocketService } from '../socket/socket.service'

@Injectable({
    providedIn: 'root'
})

export class TokenManagementService {
    constructor(
        private storageService: StorageService,
        private httpService: HttpService,
        private socketService: SocketService) {
    }

    public async checkAndUpdateTokenSocket() {
        const tokenTime = await this.storageService.getTokenTime()
        const start = moment(tokenTime)
        const minutesPassed = moment().diff(start, 'minutes')

        let token

        if (minutesPassed > 4) {
            token = await this.httpService.refreshToken()
            this.socketService.updateSocketTokenUrl(token)
        }
    }

    public async checkAndUpdateTokenAsync() {
        return new Promise(async (resolve, reject) => {
            const tokenTime = await this.storageService.getTokenTime()
            const start = moment(tokenTime)
            const minutesPassed = moment().diff(start, 'minutes')

            let token

            if (minutesPassed > 4) {
                token = await this.httpService.refreshToken()
                this.socketService.updateSocketTokenUrl(token)
                return resolve(token)
            }

            return resolve(token)
        })
    }

    public startTokenInterval(email) {
        setInterval(async () => {
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
}