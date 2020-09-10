import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router'
import { Storage } from '@ionic/storage'
import { NavController } from '@ionic/angular'
import { Observable } from 'rxjs'
import { ToastService, StorageService } from '../services'
import { reject } from 'q'

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private storage: Storage,
    private navCtrl: NavController,
    private toast: ToastService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(async resolve => {
      const email = await this.storageService.getUserEmail()
      if (email) return resolve(true)
      this.navCtrl.navigateRoot('/login')
      this.toast.showToast('Not signed in')
      return reject(false)
      // resolve(true)
    })
  }
}

