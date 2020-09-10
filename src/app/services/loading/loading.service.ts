import { Injectable } from '@angular/core'
import { LoadingController } from '@ionic/angular'

import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class LoadingService {

  constructor(
    public loadingController: LoadingController
  ) { }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: message,
      duration: 10000
    })

    return await loading.present()
  }

  async dismiss() {
    // this.isLoading = false
    return await this.loadingController.dismiss().then(() => console.log('dismissed'))
  }

}
