import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private irA: NavController
  ) { }

  public pagina (pagina: string) {
    this.irA.navigateRoot([pagina])
  }

  public atras () {
    this.irA.back()
  }
}
