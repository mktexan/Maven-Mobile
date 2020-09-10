import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { AgmOverlays } from "agm-overlays"
import { Camera } from '@ionic-native/camera/ngx'
import { Device } from '@ionic-native/device/ngx'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { Keyboard } from '@ionic-native/keyboard/ngx'
import { Autostart } from '@ionic-native/autostart/ngx'
import { File } from '@ionic-native/file/ngx'
import { Base64 } from '@ionic-native/base64/ngx'
import { Network } from '@ionic-native/network/ngx'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { AgmCoreModule } from '@agm/core'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { IonicStorageModule } from '@ionic/storage'
import { BackgroundMode } from '@ionic-native/background-mode/ngx'
import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { ShowUserPageModule } from './pages/modal/show-user/show-user.module'
import { IonImgLazyLoadModule } from './directives/ionimg-lazy-load.module'
import { OneSignal } from '@ionic-native/onesignal/ngx'
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx'
import { environment } from '../environments/environment'
import { ServiceWorkerModule } from '@angular/service-worker'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx'
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'
import { TagInputModule } from 'ngx-chips'

let config: SocketIoConfig = { url: environment.socketUrl, options: { autoConnect: false, transports: [ 'websocket' ] } }


import BackgroundGeolocation from "cordova-background-geolocation-lt"

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(environment.config),
    AppRoutingModule,
    HttpClientModule,
    AgmOverlays,
    ShowUserPageModule,
    IonImgLazyLoadModule,
    SocketIoModule.forRoot(config),
    IonicStorageModule.forRoot({
      name: '__maven',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey,
      libraries: ['places']
    }),
    ServiceWorkerModule.register('combined-worker.js', { enabled: environment.production })
  ],
  providers: [
    Autostart,
    OneSignal,
    Base64,
    NativeGeocoder,
    UniqueDeviceID,
    BackgroundGeolocation,
    BackgroundMode,
    LocalNotifications,
    Camera,
    Device,
    Geolocation,
    StatusBar,
    SplashScreen,
    Keyboard,
    File,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
