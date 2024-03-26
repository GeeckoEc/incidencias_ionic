import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { ConverterService } from 'src/app/services/converter.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-incidents-view',
  templateUrl: './incidents-view.page.html',
  styleUrls: ['./incidents-view.page.scss'],
})
export class IncidentsViewPage implements OnInit {

  id:               any
  informacion:      any
  listaAsignados:   any     = [{"usuario": "  No hay usuarios asignados."}]
  listaActividades: any     = [{"actividad": "  No hay actividades."}]
  fecha:            string  = ''

  constructor(
    private irA: NavigationService,
    private accion: ActionService,
    private servidor: ServerService,
    private almacenar: StorageService,
    private notificar: NotifyService,
    private conversor: ConverterService,
  ) { }

  async ngOnInit() {
    //await this.cargarIncidencia()
    this.establecerId()
  }

  async obtenerToken () {
    return await this.almacenar.obtener('token')
  }

  async establecerId () {
    this.id = await this.almacenar.obtener('idRegistro')
    await this.cargarIncidencia()
  }

  async cargarIncidencia () {
    let datos = {
      accion: 'informacion',
      id:     await this.almacenar.obtener('idRegistro'),
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'incidencias').subscribe(
      (respuesta: any) => {
        this.informacion  = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
        this.fecha        = this.conversor.fechaLarga(this.informacion.fecha)
      }
    )
  }

  regresar () {
    this.irA.atras()
  }
}
