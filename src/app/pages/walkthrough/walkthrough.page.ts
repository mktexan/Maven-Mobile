import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { NavController, IonSlides, MenuController } from '@ionic/angular'

import { TranslateProvider, StorageService } from '../../services'

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: ['./walkthrough.page.scss'],
})

export class WalkthroughPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides
  
  showSkip = true;
  slideOpts = {
    effect: 'flip',
    speed: 1000
  }

  dir: String = 'ltr'

  slideList: Array<any> = [
    {
      title: '<strong><span class="text-tertiary ts">Maven</span></strong>',
      description: 'blah blah blah blah blah',
      image: "assets/img/maven-black.jpg",
    },
    {
      title: '<strong><span class="text-tertiary">Maven</span></strong>',
      description: 'blah blah blah blah blah',
      image: "assets/img/maven-black.jpg",
    },
    // {
    //   title: '<strong><span class="text-tertiary">Maven</span></strong>',
    //   description: this.translate.get('intro.slide3.text'),
    //   image: 'assets/icon/maven.jpg',
    // }
  ]

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public translate: TranslateProvider,
    public storageService: StorageService,
    public router: Router
  ) {
  }

  async ionViewWillEnter() {
    this.menuCtrl.enable(false)

    let introShown = await this.storageService.getIntroShown()

    if (!introShown) this.storageService.setIntroShown(true)
  }

  ngOnInit() {
  }

  onSlideNext() {
    this.slides.slideNext(1000, false)
  }

  onSlidePrev() {
    this.slides.slidePrev(300)
  }

  // onLastSlide() {
  // 	this.slides.slideTo(3, 300)
  // }

  openHomeLocation() {
    this.navCtrl.navigateRoot('home')
    // this.router.navigateByUrl('/tabs/(home:home)')
  }

  openLoginPage() {
    this.navCtrl.navigateRoot('login')
  }
}
