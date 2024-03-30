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
  mensajeCargando:  HTMLIonLoadingElement

  listaEstados:     any = [
    'Deshabilitada', 'Activa', 'Terminada'
  ]

  listaAsignados:   any   = [
    {nombres: 'No hay', apellidos: 'usuarios asignados.'},
  ]

  listaActividades: any = [
    {actividad: 'No hay actividades registradas.'},
  ]

  constructor(
    private irA:        NavigationService,
    private accion:     ActionService,
    private servidor:   ServerService,
    private notificar:  NotifyService,
    private almacenar:  StorageService,
    private convertir:  ConverterService
  ) { }

  async ngOnInit() {
    this.mensajeCargando  = await this.notificar.mensajeCargando('Cargando...')
    await this.verificarServidor()
  }

  async verificarServidor () {
    await this.servidor.verificarServidor().subscribe(
      (respuesta: boolean) => {
        if (respuesta) {
          this.establecerPagina()
          this.mensajeCargando.dismiss()
        } else {
          setTimeout(() => {
            this.verificarServidor()
          }, 5000);
        }
      }
    )
  }
  
  async establecerPagina () {
    await this.servidor.verificarServidor().subscribe(
      (respuesta: boolean) => {
        if (respuesta) {
          this.cargarIncidencia();
        } else {
          setTimeout(() => {
            this.establecerPagina();
          }, 5000);
        }
      }
    );
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
          this.irA.pagina('home')
        }
        this.informacion  = respuesta.datos
        this.fechaIncidencia  = this.convertir.fechaLarga(respuesta.datos.fecha)
        this.estadoIncidencia = this.listaEstados[respuesta.datos.estado]
        this.almacenar.guardar('token', respuesta.token)
          this.cargarAsignados()
      }
    )
  }

  async cargarAsignados () {
     let datos = {
       accion: 'listaEstado',
       estado: 1,
       token:  await this.almacenar.obtener('token')
     }
     await this.servidor.enviar(datos, 'asignaciones').subscribe(
       (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.mensajeCargando.dismiss()
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
        }
        if (respuesta.datos !== null) {
          this.listaAsignados = respuesta.datos
        }
       }
     )
  }

  asignar () {
    this.irA.pagina('users-selector')
  }

  crearActividad () {
    this.irA.pagina('activities-form')
  }

  salir () {
    this.irA.atras()
  }
}
