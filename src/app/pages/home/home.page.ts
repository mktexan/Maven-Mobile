import { Component, NgZone, ChangeDetectorRef } from '@angular/core'
import { NavController, MenuController, AlertController } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import {
  AuthService, NetworkService, HttpService,
  SocketService, MessageService, LoadingService,
  ToastService
} from '../../services'
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx'
import * as moment from 'moment'
import { Subscription } from 'rxjs'

import BackgroundGeolocation, {
  State,
  Config,
  Location,
  LocationError,
  Geofence,
  HttpEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
  MotionChangeEvent,
  GeofenceEvent,
  GeofencesChangeEvent,
  HeartbeatEvent,
  ConnectivityChangeEvent
} from "cordova-background-geolocation-lt";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  public photo: any
  public socket_icon = "disconnected"
  public garage_icon = "closed"
  public gps_icon = "still"
  public userEmail = ""
  public human_icon = false
  public alertIcon = false
  public alertTime: any
  public cameraLocation = null
  public garageImg = "../../../assets/img/door.png"

  public timer: any
  public timerActive = false

  public userList = new Array()

  lat: any
  lng: any

  lastImage: SafeResourceUrl
  subscription: Subscription

  constructor(
    public alertController: AlertController,
    private toast: ToastService,
    private zone: NgZone,
    public loading: LoadingService,
    private messageService: MessageService,
    private socketService: SocketService,
    private nativeGeocoder: NativeGeocoder,
    private httpService: HttpService,
    public network: NetworkService,
    public storage: Storage,
    public auth: AuthService,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public domSanitizer: DomSanitizer
  ) {
    this.menuCtrl.enable(true)
    this.storage.get('userEmail').then((email) => {

    })

    this.subscription = this.messageService.getMessage().subscribe(message => {

    })
  }

  public setEmail(email: any) {
  }

  ionViewWillLeave() {
  }

  ionViewDidEnter() {
  }

  ionViewWillEnter() {
 
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('/edit-profile')
  }
}
