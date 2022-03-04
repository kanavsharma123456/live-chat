import { Injectable, NgZone } from '@angular/core';
import { LoadingController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(public toastCtrl: ToastController,
    private router: Router,
    private platform: Platform,
    private ngZone: NgZone) { }

  // messagin toast display
  async presentToast(msg, duration = 3000, position: any = 'bottom') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: position,
      color: 'dark',
      mode: 'ios'
    });
    toast.present();
  }

  async errorToast(msg, duration = 3000, position: any = 'bottom') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: position,
      color: 'dark',
      mode: 'ios'
    });
    toast.present();
  }

  async presentToastNoMoreData(msg, duration = 2000, position: any = 'bottom') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: position,
      color: 'dark',
      mode: 'ios',
      cssClass: 'toast-pagination'
    });
    toast.present();
  }

  errorHandling(res) {
    if (res.result && res.result.error) {
      this.errorToast(res.result && res.result.error);
    }
  }

  getLoaderUI() {
    return { spinner: null, message: '<img src="assets/img/dots1.svg">', cssClass: 'custom-loading', mode: 'ios' as any };
  }

  setNavigationRoute(route: string, data?: any) {
    if (data) {
      const navigationExtras: NavigationExtras = {
        state: {
          data
        }
      };
      this.ngZone.run(() => {
        console.log("ngZone....call");

        this.router.navigate([route], navigationExtras);
      });

    } else {
      this.ngZone.run(() => {
        console.log("ngZone....call");
        this.router.navigate([route]);
      });

    }

    localStorage.setItem("splaseData", JSON.stringify("other"));
  }


  isPlatformiOs() {
    return this.platform.is('ios') ? true : false;
  }

  isPlatformAndroid() {
    return this.platform.is('android') ? true : false;
  }

}
