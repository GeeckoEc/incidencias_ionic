import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, Animation } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private tostada:  ToastController,
    private alerta:   AlertController,
    private cargando: LoadingController,
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

  async mensajeCargando (texto: string) {
    const notificacion	= await this.cargando.create({
      message: texto,
      spinner: 'dots',
      showBackdrop: true,
      backdropDismiss: false,
    })
    await notificacion.present()
    return notificacion
  }
}
