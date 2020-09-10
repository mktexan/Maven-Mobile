import { Injectable } from '@angular/core'
import { Socket } from 'ngx-socket-io'
import { Observable, Subject } from 'rxjs'
import { environment } from '../../../environments/environment'
import { StorageService } from '../../services/storage/storage.service'
import { HttpService } from '../../services/http/http.service'
import { MessageService } from '../../services/message/mesage.service'
import { NetworkService } from '../network/network.service'
import { LoadingService } from '../loading/loading.service'

import * as moment from 'moment'
import { ToastService } from '../toast/toast.service'

@Injectable({
    providedIn: 'root'
})

export class SocketService {
    constructor(
        private toast: ToastService,
        private loading: LoadingService,
        private socket: Socket,
        private network: NetworkService,
        private storageService: StorageService,
        private httpService: HttpService,
        private messageService: MessageService) {
        this.socket.on('disconnect', async (reason: any) => {
            this.messageService.sendMessage('dc')
            this.storageService.setConnectionStatus(false)
            // this.toast.showToast('Lost server connection. Stand by.')
            if (reason === 'transport close') {
                console.log('refreshing token from socket service disconnect')
                await this.checkAndUpdateTokenAsync()
                this.connectSocketTokenUpdated()
            }
        })

        this.socket.on('connect', (attemptNumber) => {
            console.log('socket connected')
            // this.toast.showToast('Connected to Maven!')
            this.storageService.setConnectionStatus(true)
            this.messageService.sendMessage('con')
            this.loading.dismiss()
        })

        socket.on('reconnect_attempt', () => {
            this.messageService.sendMessage('rc')
        })

        this.socket.on('error', async (err) => {
            this.storageService.setConnectionStatus(false)
            // this.toast.showToast('Lost server connection. Stand by.')
            // await this.checkAndUpdateTokenAsync()
            // this.connectSocketTokenUpdated()
        })

        this.socket.on('reconnect_error', async (err) => {
            this.storageService.setConnectionStatus(false)
            // this.toast.showToast('Server reconnection failed. Please check internet connection.')
            // await this.checkAndUpdateTokenAsync()
            // this.connectSocketTokenUpdated()
        })
    }

    public disconnectSocket() {
        this.storageService.setConnectionStatus(false)
        // this.socket.removeAllListeners()
        this.socket.disconnect()
        console.log('socket disconnected')
    }

    public connectSocket = (token) => {
        this.socket.ioSocket.io.uri = environment.socketUrl + token
        this.socket.connect()
        this.messageService.sendMessage('con')
    }

    public connectSocketTokenUpdated = () => {
        this.socket.connect()
        this.messageService.sendMessage('con')
    }

    public updateSocketTokenUrl = (token) => {
        this.socket.ioSocket.io.uri = environment.socketUrl + token
    }

    public ping() {
        return Observable.create((observer) => {
            this.socket.on('pong', () => {
                observer.next()
            })
        })
    }

    public sendAliveNotification(user: any) {
        this.socket.emit("alive", { user: user, timeStamp: new Date() }, response => {
            if (response) this.messageService.sendMessage('con')
        })
    }

    public sendChatMessage(toSend: any) {
        this.socket.emit("sentMessage", toSend)
    }

    public sendUserTyping(toSend: any) {
        this.socket.emit("userTypingReceive", toSend)
    }

    public disconnect = () => {
        return Observable.create((observer) => {
            this.socket.on('disconnect', (reason) => {
                observer.next(reason)
            })
        })
    }

    public connect = () => {
        return Observable.create((observer) => {
            this.socket.on('connect', (attemptNumber) => {
                observer.next(attemptNumber)
            })
        })
    }

    public reconnecting = () => {
        return Observable.create((observer) => {
            this.socket.on('reconnecting', (attemptNumber) => {
                observer.next(attemptNumber)
            })
        })
    }

    public testGetMessage() {
        return new Observable<any>(observer => {
            this.socket.on('chatMessage', (message: any) => observer.next(message))
        })
    }

    public chatMessage = () => {
        return Observable.create((observer) => {
            this.socket.on('chatMessage', (message: any) => {
                observer.next(message)
            })
        })
    }

    public userTyping = () => {
        return Observable.create((observer) => {
            this.socket.on('userTyping', (message: any) => {
                observer.next(message)
            })
        })
    }

    public aliveResponse = () => {
        return Observable.create((observer) => {
            this.socket.on('aliveResponse', (message: any) => {
                observer.next(message)
            })
        })
    }

    public connectionError = () => {
        return Observable.create((observer) => {
            this.socket.on('error', (err) => {
                observer.next(err)
            })
        })
    }

    public async checkAndUpdateTokenAsync() {
        return new Promise(async (resolve, reject) => {
            console.log('checking and updating token')
            const tokenTime = await this.storageService.getTokenTime()
            const start = moment(tokenTime)
            const minutesPassed = moment().diff(start, 'minutes')

            let token

            if (minutesPassed > 4) {
                token = await this.httpService.refreshToken()
                this.updateSocketTokenUrl(token)
                return resolve(token)
            }

            return resolve(token)
        })
    }
}

