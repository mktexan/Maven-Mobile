import { Component, OnInit } from '@angular/core'
import { NavController, LoadingController, MenuController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { StorageService } from '../../../services/index'

@Component({
  selector: 'app-loader',
  templateUrl: './loader.page.html',
  styleUrls: ['./loader.page.scss'],
})
export class LoaderPage implements OnInit {

  constructor(
    public storageService: StorageService,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public storage: Storage,
    public loadingController: LoadingController
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false)
  }

  async ngOnInit() {
    const introShown = await this.storageService.getIntroShown()
    const accountType = await this.storageService.getAccountType()

    if (introShown && accountType === 'influencer') return this.navCtrl.navigateRoot('/job-seeker')
    if (introShown && accountType === 'business') return this.navCtrl.navigateRoot('/business-owner')
    else return this.navCtrl.navigateRoot('/walkthrough')
  }
}
