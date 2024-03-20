import { Injectable, Inject } from '@angular/core';
import { Preferences, PreferencesPlugin } from '@capacitor/preferences';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    @Inject(Preferences) private preferencias: PreferencesPlugin,
    private almacenar: Storage
  ) { }

  async guardar (indice: string, datos: any) {
    /*await this.preferencias.set({
      key: indice,
      value: datos
    })*/
    await this.almacenar.set(indice, datos)
  }

  async obtener (indice: string) {
    /* let datos = await this.preferencias.get({
      key: indice
    }) */
    let datos = await this.almacenar.get(indice)
    return datos.value
  }

  async eliminar (indice: string) {
    /* await this.preferencias.remove({
      key: indice
    }) */
    await this.almacenar.remove(indice)
  }

  async limpiar () {
    /* await this.preferencias.clear() */
    await this.almacenar.clear()
  }
}
