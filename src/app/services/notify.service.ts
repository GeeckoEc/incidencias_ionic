import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private tostada:  ToastController,
    private alerta:   AlertController
  ) { }

  async notificarSimple (mensaje: string) {
    const notificacion = await this.tostada.create({
      message:    mensaje,
      duration:   4000,
      position:   'bottom'
    })
    await notificacion.present()
  }

  async notificarComplejo (titulo: string, mensaje: string, icono: string, color: string) {
    const notificacion = await this.tostada.create({
      header:   titulo,
      message:  mensaje,
      icon:     icono,
      color:    color,
      duration: 5000,
      position: 'bottom'
    });
    await notificacion.present()
  }
}
