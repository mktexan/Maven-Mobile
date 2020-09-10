import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NavController, MenuController, AlertController, ActionSheetController } from '@ionic/angular'
import { Subscription } from 'rxjs'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Base64 } from '@ionic-native/base64/ngx'
import { Storage } from '@ionic/storage'
import { Keyboard } from '@ionic-native/keyboard/ngx'
import { Crop } from '@ionic-native/crop/ngx'
import { Camera } from '@ionic-native/camera/ngx'
//import { User } from '../../models'

import {
  TranslateProvider,
  AuthService,
  LoadingService,
  StorageService,
  ToastService,
  NetworkService,
  NotificationService,
  HttpService,
  MessageService
} from '../../services'

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit, OnDestroy {
  private win: any = window
  public eprofileForm: FormGroup
  public uniqueUsername: boolean
  public hasPushToken: boolean
  public subscription: Subscription
  public user
  public notifications
  email: any
  photo: any
  userId: string
  hasError: boolean
  hasPassword: boolean

  constructor(
    private messageService: MessageService,
    public domSanitizer: DomSanitizer,
    private base64: Base64,
    private localStorage: Storage,
    private httpService: HttpService,
    public translate: TranslateProvider,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loading: LoadingService,
    public toast: ToastService,
    public formBuilder: FormBuilder,
    public menuCtrl: MenuController,
    public asCtrl: ActionSheetController,
    public network: NetworkService,
    private keyboard: Keyboard,
    private camera: Camera,
  ) { }

  ngOnInit() {
    this.eprofileForm = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-z.]{4,20}$')
      ])],
      firstName: ['', Validators.compose([
        Validators.required
      ])],
      lastName: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])]
    })
  }

  ngOnDestroy() {

  }

  ionViewWillLeave() {
  }

  ionViewWillEnter() {
    this.localStorage.get('userEmail').then((email) => {
      this.email = email
      // this.httpService.getUser(email)
      //   .then((user: User[]) => {
      //     let val = user['user']
      //     this.eprofileForm.setValue({
      //       firstName: val.firstName,
      //       lastName: val.lastName,
      //       username: val.userName,
      //       email: val.email
      //     })
      //     this.notifications = true
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    })

    this.localStorage.get('userPhoto').then((pic) => {
      this.photo = this.domSanitizer.bypassSecurityTrustUrl(pic)
    })
  }

  onInput(username: string) {
    // Check if the username entered on the form is still available.
    this.uniqueUsername = true
    if (this.eprofileForm.controls.username.valid && !this.eprofileForm.controls.username.hasError('required')) {

    }
  }


  keyDownFunction(event) {
    // User pressed return on keypad, proceed with updating profile.
    if (event.keyCode === 13) {
      this.keyboard.hide()
      this.updateProfile()
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.eprofileForm.controls }


  async setPhotoByWeb(event) {
    console.log('userID setPhoto: ', this.userId)
  }

  async setPhoto() {
    // Allow user to upload and set their profile photo using their camera or photo gallery.
    if (this.network.online()) {

      const actionSheet = await this.asCtrl.create({
        header: this.translate.get('auth.profile.photo.title'),
        buttons: [
          {
            text: this.translate.get('auth.profile.photo.take'),
            role: 'destructive',
            handler: () => {
            }
          },
          {
            text: this.translate.get('auth.profile.photo.gallery'),
            handler: () => {
              let cameraOptions = {
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: this.camera.DestinationType.DATA_URL,
                quality: 100,
                targetWidth: 150,
                targetHeight: 150,
                encodingType: this.camera.EncodingType.PNG,
                correctOrientation: true
              }
              this.camera.getPicture(cameraOptions)
                .then(file_uri => {
                  let base64Image = 'data:image/jpeg;base64,' + file_uri
                  this.localStorage.set('userPhoto', base64Image)
                  this.photo = this.domSanitizer.bypassSecurityTrustUrl(base64Image)
                  this.messageService.sendMessage('newPhoto')
                  // this.httpService.saveUserPhoto(this.email, base64Image)
                  //   .then(_ => {
                  //     console.log('user photo saved to database')
                  //   })
                  //   .catch(err => {
                  //     this.toast.showToast(this.translate.get(err.code))
                  //   })
                },
                  err => console.log(err))
            }
          },
          {
            text: this.translate.get('auth.profile.photo.cancel'),
            role: 'cancel',
            handler: () => { }
          }
        ]
      })

      await actionSheet.present()
    }
  }

  public updateProfile(): void {

  }

}
