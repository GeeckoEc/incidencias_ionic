import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-main-start',
  templateUrl: './main-start.page.html',
  styleUrls: ['./main-start.page.scss'],
})
export class MainStartPage implements OnInit {
  nombre:             string  = ''
  cargandoEjecutado:  boolean = false
  constructor(
    private irA: NavigationService,
    private almacenar: StorageService,
    private accion: ActionService,
    private servidor: ServerService,
    private notificar: NotifyService,
  ) { }

  ngOnInit() {
    this.cargarNombre()
    this.verificarSesion()
  }

  async verificarSesion () {
    let datos = {
      accion: 'verificarSesion',
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'autenticar').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          return
        }
      }
    )
  }

  async cargarNombre () {
    this.nombre = await this.almacenar.obtener('nombres')
    this.nombre = this.nombre.split(' ')[0]
  }

  irIncidencias () {
    this.irA.pagina('incidents-list')
  }

  irReportes () {
    this.irA.pagina('reports-list')
  }

  irUsuarios () {
    this.irA.pagina('users-list')
  }

  irConfiguracion () {
    this.irA.pagina('settings')
  }

  async cerrarSesion () {
    let botones = [
      {
        text: 'Cerrar sesión',	
        role: 'destructive',
        handler: () => {
          this.almacenar.limpiar()
          this.irA.pagina('home')
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel',
      }
    ]
    await this.accion.mensajeAccion('Cerrar sesión', '¿Desea cerrar la sesión?', botones)
  }
}
