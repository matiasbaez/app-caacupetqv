import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UIService {

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  showConfirmAlert(message: string) {
    const ts = this;
    return new Promise(async resolve => {
      const alert = await ts.alertCtrl.create({
        message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          }, {
            text: 'Aceptar',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });
      await alert.present();
    });
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500
      // position: 'top'
    });
    await toast.present();
  }
}
