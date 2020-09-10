import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { ChatMessage } from 'src/app/models/chat-message'

@Injectable({ providedIn: 'root' })

export class MessageService {
    private subject = new Subject<any>()

    sendMessage(message: string) {
        this.subject.next({ text: message })
    }

    sendUserChatMessage(message: ChatMessage) {
        this.subject.next(message)
    }

    clearMessages() {
        this.subject.next()
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable()
    }

    getChatMessage(): Observable<ChatMessage> {
        return this.subject.asObservable()
    }
}