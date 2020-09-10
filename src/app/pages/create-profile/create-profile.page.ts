import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, AlertController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage'
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Camera } from '@ionic-native/camera/ngx';
// import { User } from '../../models';

import {
  TranslateProvider,
  AuthService,
  LoadingService,
  StorageService,
  ToastService,
  NetworkService,
  NotificationService,
  HttpService
} from '../../services';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.page.html',
  styleUrls: ['./create-profile.page.scss'],
})

export class CreateProfilePage implements OnInit {
  public profileForm: FormGroup;
  public firstName = ''
  public email = ''
  public lastName = ''
  public userName = ''
  public uniqueUsername: boolean;
  photo = 'assets/img/profile.png';
  userId: string;
  hasError: boolean;

  constructor(
    private storageS: Storage,
    public httpService: HttpService,
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
    private storage: StorageService,
    private notification: NotificationService,
    private auth: AuthService
  ) {
  }

  ionViewWillEnter() {
    // console.log(this.network.platforms());
    this.menuCtrl.enable(false);
    this.storageS.get('userEmail').then((email) => {
      // this.httpService.getUser(email)
      //   .then((user: User) => {
      //     console.log(user)
      //     this.setValue(user)
      //   })
      //   .catch(err => {
      //     console.log(err)

      //   })
    })
  }

  setValue(user) {
    this.profileForm.setValue({
      firstName: user['user']['firstName'],
      lastName: user['user']['lastName'],
      username: user['user']['userName'],
      email: user['user']['email']
    });
    this.email = user['user']['email']
    this.userName = user['user']['userName']
    this.firstName = user['user']['firstName']
    this.lastName = user['user']['lastName']
  }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
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
    });
  }

  ionViewWillLeave() { }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  keyDownFunction(event) {
    // User pressed return on keypad, proceed with creating profile.
    if (event.keyCode === 13) {
      this.keyboard.hide()
      this.createProfile(this.profileForm)
    }
  }

  onInput(username: string) {
    this.uniqueUsername = true;
    if (this.profileForm.controls.username.valid && !this.profileForm.controls.username.hasError('required')) {
    }
  }

  public createProfile(profileForm: FormGroup): void {
    if (!profileForm.valid || !this.uniqueUsername) {
      this.hasError = true
    } else {
      if (this.uniqueUsername) {
        this.loading.showLoading('Creating profile...')
        // this.httpService.modifyUser(this.email,
        //   {
        //     'userName': profileForm.value['username'], 'firstName': profileForm.value['firstName'].toLowerCase(),
        //     'lastName': profileForm.value['lastName'].toLowerCase()
        //   })
        //   .then((user: User) => {
        //     this.storageS.set('firstName', profileForm.value['firstName'])
        //     this.storageS.set('lastName', profileForm.value['lastName'])
        //     this.loading.dismiss()
        //     this.navHome()
        //   })
        //   .catch(err => {
        //     this.toast.showToast(this.translate.get(err.code))
        //   })
      }
    }
  }

  private navHome() {
    this.navCtrl.navigateRoot('/home')
  }

  private updateUserData(profileForm) {
    const firstName = profileForm.value['firstName'].charAt(0).toUpperCase()
      + profileForm.value['firstName'].slice(1).toLowerCase();

    const lastName = profileForm.value['lastName'].charAt(0).toUpperCase()
      + profileForm.value['lastName'].slice(1).toLowerCase();
  }

  public async navigateToBusiness() {
    const alert = await this.alertCtrl.create({
      header: 'Business Owner',
      message: 'You are a business owner. Is this correct?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
          handler: async () => {
            await this.modifyUserAccoutnType('business')
            this.navCtrl.navigateRoot('/business-owner')
          }
        }
      ]
    })

    await alert.present()
  }

  public async modifyUserAccoutnType(type: any) {
    const accountType = await this.httpService.modifyUserAccountType(type)
    this.storageS.set('accountType', type)
  }

  public async navigateToInfluencer() {
    const alert = await this.alertCtrl.create({
      header: 'Influencer',
      message: 'You are an influencer. Is this correct?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
          handler: async () => {
            await this.modifyUserAccoutnType('influencer')
            this.navCtrl.navigateRoot('/job-seeker')
          }
        }
      ]
    })

    await alert.present()
  }

  async setPhotoByWeb(event) {

  }

  // async setPhoto() {
  //   // Allow user to upload and set their profile photo using their camera or photo gallery.
  //   if (this.network.online()) {

  //     const actionSheet = await this.asCtrl.create({
  //       header: this.translate.get('auth.profile.photo.title'),
  //       buttons: [
  //         {
  //           text: this.translate.get('auth.profile.photo.take'),
  //           role: 'destructive',
  //           handler: () => {
  //             this.storage.upload(
  //               this.userId,
  //               this.camera.PictureSourceType.CAMERA).then((url: string) => {
  //                 this.storage.delete(this.userId, this.photo);
  //                 this.photo = url;
  //               }).catch(() => { });
  //           }
  //         },
  //         {
  //           text: this.translate.get('auth.profile.photo.gallery'),
  //           handler: () => {
  //             this.storage.upload(
  //               this.userId,
  //               this.camera.PictureSourceType.PHOTOLIBRARY).then((url: string) => {
  //                 this.storage.delete(this.userId, this.photo);
  //                 this.photo = url;
  //               }).catch(() => { });
  //           }
  //         },
  //         {
  //           text: this.translate.get('auth.profile.photo.cancel'),
  //           role: 'cancel',
  //           handler: () => { }
  //         }
  //       ]
  //     });

  //     await actionSheet.present();
  //   }
  // }

}
