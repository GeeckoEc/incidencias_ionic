import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-incidents-list',
  templateUrl: './incidents-list.page.html',
  styleUrls: ['./incidents-list.page.scss'],
})
export class IncidentsListPage implements OnInit {

  listaIncidencias: any
  listaEstados:    any    = [
    {
      id:  0,
      nombre: 'Deshabilitadas'
    },
    {
      id:  1,
      nombre: 'Activas'
    },
    {
      id:  2,
      nombre: 'Terminadas'
    }
  ]
  deshabilitarSliding: boolean  =  false
  estado:           string  = '1'

  constructor(
    private accion: ActionService,
    private irA: NavigationService,
    private notificar: NotifyService,
    private servidor: ServerService,
    private almacenar: StorageService,
  ) { }

  ngOnInit() {
    this.cargarIncidencias()
  }

  async obtenerToken () {
    let datos = await this.almacenar.obtener('token')
    if (datos == null) {
      this.irA.pagina('home')
      return
    }
    return datos
  }

  async cargarIncidencias () {
    let datos = {
      accion: 'lista',
      estado: this.estado,
      token:  await this.obtenerToken()
    }
    await this.servidor.enviar(datos, 'incidencias').subscribe(
      (respuesta: any) => {
        if (respuesta.estado) {
          this.almacenar.guardar('token', respuesta.token)
          let cantidad = respuesta.datos
          if (cantidad.length == 0) {
            this.listaIncidencias = [{
              asunto: 'No hay incidencias '+ this.listaEstados[parseInt(this.estado)].nombre.toLowerCase() +'.',
              id: 0,
            }]
            this.deshabilitarSliding = true
          } else {
            this.listaIncidencias = respuesta.datos
          }
        } else {
          this.notificar.notificarComplejo('Sesión:', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
        }
      }
    )
  }

  async nuevaIncidencia () {
    await this.irA.pagina('incidents-form')
  }

  async verIncidencia (id: number) {

  }

  async editarIncidencia (id: number) {
    await this.almacenar.guardar('idRegistro', id).then(
      (dato: any) => {
        this.irA.pagina('incidents-form')
      }
    )
  }

  async deshabilitarIncidencia (id: string) {
    
  }

  async regresar () {
    await this.irA.atras()
  }

}
