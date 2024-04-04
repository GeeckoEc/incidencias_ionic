import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  estado:             number  = 2
  mensajeCargando:    HTMLIonLoadingElement
  ocultarLista:       boolean = true
  deshabilitarLista:  boolean = false
  listaIncidencias:   any
  listaEstados:       any    = [
    {
      id:  1,
      nombre: 'Activas'
    },
    {
      id:  0,
      nombre: 'Deshabilitadas'
    },
    {
      id:  2,
      nombre: 'Terminadas'
    }
  ]

  constructor(
    private irA:  NavigationService,
    private servidor: ServerService,
    private almacenar: StorageService,
    private accion: ActionService,
    private notificar: NotifyService,

  ) { }

  ngOnInit() {
  }

  async cargarIncidencias () {
    this.mensajeCargando  = await this.notificar.mensajeCargando('Cargando incidencias...')
    let datos = {
      accion: 'lista',
      estado: this.estado,
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'incidencias').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          this.mensajeCargando.dismiss()
          return
        }
        this.almacenar.guardar('token', respuesta.token)
        this.listaIncidencias = respuesta.datos
        let cantidad = respuesta.datos
        let estadoSeleccionado  = this.listaEstados.findIndex((item:any) => item.id == this.estado)
        if (cantidad.length == 0) {
          this.listaIncidencias = [{
            asunto: 'No hay incidencias '+ this.listaEstados[estadoSeleccionado].nombre.toLowerCase() +'.',
            id: 0,
          }]
          this.deshabilitarLista  = true
        } else {
          this.deshabilitarLista  = false
        }
        this.ocultarLista = false
        this.mensajeCargando.dismiss()
      }
    )
  }

  async cerrarIncidencias () {
    this.mensajeCargando  = await this.notificar.mensajeCargando('Limpiando incidencias...')
    this.ocultarLista = true
    this.deshabilitarLista = false
    this.listaIncidencias = []
    this.mensajeCargando.dismiss()
  }

  async irReporteIncidencia (id: number) {
    await this.almacenar.guardar('idIncidencia', id)
    this.irA.pagina('incidences-summary')
  }

  salir () {
    this.irA.atras()
  }
}
