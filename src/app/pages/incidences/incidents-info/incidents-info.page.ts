import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { ConverterService } from 'src/app/services/converter.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-incidents-info',
  templateUrl: './incidents-info.page.html',
  styleUrls: ['./incidents-info.page.scss'],
})
export class IncidentsInfoPage implements OnInit {

  informacion:      any
  titulo:           string  = 'Detalles de la Incidencia'
  fechaIncidencia:  string  = ''
  estadoIncidencia: string  = ''

  listaEstados:     any = [
    'Deshabilitada', 'Activa', 'Terminada'
  ]

  constructor(
    private irA:        NavigationService,
    private accion:     ActionService,
    private servidor:   ServerService,
    private notificar:  NotifyService,
    private almacenar:  StorageService,
    private convertir:  ConverterService
  ) { }

  ngOnInit() {
    this.cargarIncidencia()
  }

  async cargarIncidencia () {
    let datos = {
      accion: 'informacion',
      id:     await this.almacenar.obtener('idRegistro'),
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'incidencias').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          //this.almacenar.eliminar('token')
          this.irA.pagina('home')
        }
        this.informacion  = respuesta.datos
        this.fechaIncidencia  = this.convertir.fechaLarga(respuesta.datos.fecha)
        this.estadoIncidencia = this.listaEstados[respuesta.datos.estado]
        this.almacenar.guardar('token', respuesta.token)
      }
    )
  }

  async almacenarInfo (informacion: any) {
    await this.almacenar.guardar('informacion', informacion);
  }

  salir () {
    this.irA.atras()
  }
}
