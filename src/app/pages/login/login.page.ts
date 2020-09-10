
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NavController, MenuController, AlertController, Platform } from '@ionic/angular'

import { Keyboard } from '@ionic-native/keyboard/ngx'

import { Storage } from '@ionic/storage'

import { StorageService } from '../../services/storage/storage.service'

import { User } from '../../models'

import {
  TranslateProvider,
  AuthService,
  LoadingService,
  ToastService,
  NotificationService,
  HttpService,
  MessageService,
  SocketService
} from '../../services'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  loginForm: FormGroup
  hasError: boolean

  constructor(
    private socketService: SocketService,
    private platform: Platform,
    private messageService: MessageService,
    private storageService: StorageService,
    private httpService: HttpService,
    public translate: TranslateProvider,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loading: LoadingService,
    public toast: ToastService,
    public formBuilder: FormBuilder,
    public keyboard: Keyboard,
    public menuCtrl: MenuController,
    public storage: Storage,
    private notification: NotificationService,
    private auth: AuthService
  ) { }

  ionViewDidEnter() {
    setTimeout(() => {
      this.menuCtrl.enable(false)
    }, 1000)
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])]
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls }

  keyDownFunction(event) {
    // User pressed return on keypad, proceed with logging in.
    if (event.keyCode === 13) {
      this.keyboard.hide()
      this.login(this.loginForm)
    }
  }

  async login(loginForm: FormGroup) {
    const email = loginForm.value['email'].toLowerCase()
    const password = loginForm.value['password']

    this.storageService.setDeviceHeight(this.platform.height())
    this.storageService.setDeviceWidth(this.platform.width())

    await this.storageService.setUserEmail(email)
    await this.storageService.setUserPassword(password)

    if (!loginForm.valid) return this.toast.showToast('invalid form')

    await this.httpService.login(email, password)
      .then(async token => {
        const account = await this.httpService.getAccount(token)
        const accountType = account['accountType']

        await this.storageService.setToken(token['token'])

        this.messageService.sendMessage('login')

        this.socketService.connectSocket(token)

        this.storageService.setIntroShown(true)

        if (accountType === 'business') return this.navCtrl.navigateRoot('/business-owner')
        else return this.navCtrl.navigateRoot('/job-seeker')
      })
      .catch(err => {
        this.toast.showToast('Wrong username or password')
        console.log(err)
      })
  }

  private dismissLoading() {
    this.loading.dismiss()
  }


  private errorHandler() {
    this.dismissLoading()
    this.toast.showToast('Wrong username or password')
    this.hasError = true
    return
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: this.translate.get('auth.login.label.forgot'),
      message: this.translate.get('auth.login.text.forgot'),
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: this.translate.get('app.label.email')
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Confirm',
          handler: async (input) => {
            const loader = await this.loading.loadingController.create({
              duration: 3000
            })
            loader.present()

            this.httpService.resetPassword(input.email).then(r => {
              loader.dismiss()
              this.toast.showToast(this.translate.get('auth.login.text.sended'))
            }).catch(err => {
              loader.dismiss()
              this.toast.showToast(this.translate.get('auth.login.text.sended'))
            })
          }
        }
      ]
    })
    await alert.present()
  }

  goToRegister() {
    this.navCtrl.navigateRoot('/register')
  }
}
