import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NavController, MenuController, AlertController } from '@ionic/angular'
import { Keyboard } from '@ionic-native/keyboard/ngx'
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx'
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal/ngx'
import { Storage } from '@ionic/storage'

import { User } from '../../models'

import {
  TranslateProvider,
  HttpService,
  AuthService,
  LoadingService,
  ToastService,
  NetworkService,
  StorageService,
  MessageService
} from '../../services'
import { Message } from '@angular/compiler/src/i18n/i18n_ast'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup
  private hasError: boolean
  private userNameOrCompany = "Username"

  constructor(
    private oneSignal: OneSignal,
    private messageService: MessageService,
    private storageService: StorageService,
    private uniqueDeviceID: UniqueDeviceID,
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
    private network: NetworkService,
    private auth: AuthService
  ) {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false)
  }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])],
      confirmPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])],
      userName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1)
      ])],
      accountType: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1)
      ])]
    })
  }

  get f() { return this.onRegisterForm.controls }


  private keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.keyboard.hide()
      this.register(this.onRegisterForm)
    }
  }

  async register(registerForm: FormGroup) {
    const userName = registerForm.value['userName']
    const password = registerForm.value['password']
    const confirm = registerForm.value['confirmPassword']
    const accountType = registerForm.value['accountType'].toLowerCase()
    const email = registerForm.value['email'].toLowerCase()

    if (!registerForm.valid || registerForm.value['password'] != confirm) {
      this.hasError = true
    } else {
      await this.storageService.setUserEmail(email)
      await this.storageService.setUserPassword(password)
      await this.storageService.setUserName(userName)
      await this.storageService.setUserUid('21321321321321')

      const id = await this.getOneSignalId()
      const token = await this.getOneSignalToken()

      await this.httpService.register(email, password, userName, '21321321321321', token, id)
        .then(async data => {
          this.messageService.sendMessage('login')
          await this.storageService.setToken(data['token'])
          await this.storageService.setIntroShown(true)
          await this.modifyUserAccoutnType(accountType)
        })
        .catch(err => {
          this.toast.showToast('User already exists!')
        })
    }
  }

  private getOneSignalId() {
    return new Promise((resolve, reject) => {
      this.oneSignal.getIds().then(data => {
        resolve(data.userId)
      })
    })
  }

  private getOneSignalToken() {
    return new Promise((resolve, reject) => {
      this.oneSignal.getIds().then(data => {
        resolve(data.pushToken)
      })
    })
  }

  private onChange(value) {
    if (value === "Business") return this.userNameOrCompany = "Company Name"
    return this.userNameOrCompany = "Username"
  }

  private async modifyUserAccoutnType(type: any) {
    const accountType = await this.httpService.modifyUserAccountType(type)
    this.storageService.setAccountType(type)
    if (type === "business") this.navCtrl.navigateRoot('/business-owner')
    else this.navCtrl.navigateRoot('/job-seeker')
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/login')
  }

  dismissLoadingSpinner() {
    this.loading.dismiss()
  }

  public registerWithFacebook(): void {

  }
}
