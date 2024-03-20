import { Injectable } from '@angular/core';
import { Preferences, PreferencesPlugin } from '@capacitor/preferences';



@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private preferencias: PreferencesPlugin
  ) { }

  async guardar (indice: string, datos: any) {
    await this.preferencias.set({
      key: indice,
      value: datos
    })
  }

  async obtener (indice: string) {
    let datos = await this.preferencias.get({
      key: indice
    })
    return datos.value
  }

  async eliminar (indice: string) {
    await this.preferencias.remove({
      key: indice
    })
  }

  async limpiar () {
    await this.preferencias.clear()
  }
}
