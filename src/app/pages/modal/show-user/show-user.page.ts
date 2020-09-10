import { Component } from '@angular/core'
import { NavParams, ModalController, AlertController } from '@ionic/angular'

import {
  NetworkService,
  TranslateProvider,
  LoadingService,
  ToastService,
  NotificationService
} from '../../../services'

//import { User } from '../../../models';

@Component({
  selector: 'app-show-user',
  templateUrl: './show-user.page.html',
  styleUrls: ['./show-user.page.scss'],
})
export class ShowUserPage {

  public user

  constructor(
    public navParams: NavParams,
    public translate: TranslateProvider,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private network: NetworkService,
    private loading: LoadingService,
    private toast: ToastService,
    private notification: NotificationService
  ) {
     console.log(navParams.data.user)
    this.user = navParams.data.user
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }

}
