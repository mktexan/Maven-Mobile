import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root'
})


export class NotificationService {

  constructor(
    private localNotifications: LocalNotifications
  ) {
  }

  // Called after user is logged in to set the pushToken on Firestore.
  public init(): void {
    // Schedule a single notification

  }

  public notifyMessageReceived(fromUser: any, message: any) {
    this.localNotifications.schedule({
      title: fromUser,
      text: message,
      foreground: true,
      icon: 'file://assets/img/transparent-logo.png',
    })
  }
}
