import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private irA: NavController
  ) { }
  
  /** Permite navegar entre páginas. especificando el nombre de la página  al aque se necesita recurrir.
   * 
   * @param pagina El nombre de la página a la que se necesita ir.
   */
  public pagina (pagina: string) {
    this.irA.navigateRoot(pagina, {animated: true,})
  }

  /** Permite navigar hacia una página anterior.
   * 
   */
  public atras () {
    this.irA.back()
  }
}
