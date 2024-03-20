import { Component, OnInit} from '@angular/core';
import { ServerService } from '../services/server.service';
import { NavigationService } from '../services/navigation.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private servidor:   ServerService,
    private almacenar:  StorageService,
    private ir:         NavigationService,
  ) {}

  ngOnInit () {
    this.token()
  }

  async token () {
    await this.almacenar.obtener('token').then(
      (datos: any) => {
        this.verificarSesion(datos)
      }
    )
  }

  async verificarSesion (token: string) {
    if (token == null) {
      this.ir.pagina('sign-in')
      return
    }
    let datos = {
      accion: 'verificarSesion',
      token: token
    }
    await this.servidor.enviar(datos, 'autenticar').subscribe(
      (datos: any) => {
        if (datos.estado == true) {
          this.ir.pagina('main-start')
        } else {
          this.ir.pagina('sign-in')
        }
      }
    ) 
  }
}
