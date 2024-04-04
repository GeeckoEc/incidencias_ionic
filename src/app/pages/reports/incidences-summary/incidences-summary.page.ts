import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { ConverterService } from 'src/app/services/converter.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-incidences-summary',
  templateUrl: './incidences-summary.page.html',
  styleUrls: ['./incidences-summary.page.scss'],
})
export class IncidencesSummaryPage implements OnInit {

  incidencia:     any
  mensajeCargando: HTMLIonLoadingElement

  constructor(
    private irA: NavigationService,
    private almacenar: StorageService,
    private accion: ActionService,
    private servidor: ServerService,
    private notificar: NotifyService,
    private convertir: ConverterService
  ) { }

  ngOnInit() {
    this.cargarIncidencia()
  }

  async cargarIncidencia () {
    this.mensajeCargando  = await this.notificar.mensajeCargando('Cargando incidencia...')
    let datos = {
      accion: 'informacion',
      token:  await this.almacenar.obtener('token'),
      incidencia: 2/* await this.almacenar.obtener('idIncidencia') */
    }
    await this.servidor.enviar(datos, 'incidencias').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          this.mensajeCargando.dismiss()
          return
        }
        this.incidencia = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
        this.mensajeCargando.dismiss()
      }
    )
  }

  salir () {
    this.irA.atras()
  }
}
