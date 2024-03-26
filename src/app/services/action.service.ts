import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(
    private actionSheetController: ActionSheetController,
  ) { }

  async mensajeAccion(titulo: string, subTitulo: string, botones: any[]) {
    const actionSheet = await this.actionSheetController.create({
      header: titulo,
      subHeader: subTitulo,
      buttons: botones
    });
    await actionSheet.present();
    return actionSheet;
  }
}
