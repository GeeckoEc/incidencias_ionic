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
  listaEstatus:     any
  nuevoEstatus:     number  = 0
  ocultarEstatus:   boolean = false
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
    {descripcion: 'No hay actividades registradas.'},
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
    await this.cargarEstatus()
    await this.cargarActividades()
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
      id:     await this.almacenar.obtener('idIncidencia'),
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
        this.nuevoEstatus = this.informacion.estatus_id
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

  async cargarEstatus () {
    let datos = {
      accion: 'listaCompleta',
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'estatus').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
        }
        this.listaEstatus = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
      }
    )
  }

  async cargarActividades () {
    let datos = {
      accion: 'listaIncidencia',
      incidencia: await this.almacenar.obtener('idIncidencia'),
      token: await this.almacenar.obtener('token'),
      estado: 1,
    }
    await this.servidor.enviar(datos, 'actividades').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          return
        }
        this.listaActividades = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
      }
    )
  }

  cambiarEstatus () {
    this.ocultarEstatus = true
  }

  cancelarCambio () {
    this.ocultarEstatus = false
  }

  async cambiarNuevoEstatus () {
    let botones = [
      {
        text: 'Sí',
        handler: async () => {
          let datos = {
            accion: 'cambiarEstatus',
            id:     await this.almacenar.obtener('idIncidencia'),
            estatus: this.nuevoEstatus,
            token:  await this.almacenar.obtener('token')
          }
          await this.servidor.enviar(datos, 'incidencias').subscribe(
            (respuesta: any) => {
              if (respuesta.sesion !== undefined) {
                this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
                this.irA.pagina('home')
              }
              this.notificar.notificarComplejo('Estado', respuesta.mensaje, 'checkmark-circle-outline', 'success')
              this.cargarIncidencia()
              this.ocultarEstatus = false
              this.almacenar.guardar('token', respuesta.token)
            }
          )
        }
      },
      {
        text: 'No',
        role: 'cancel',
      }
    ]
    await this.accion.mensajeAccion('Cambiar Estatus', '¿Desea cambiar el estatus de la incidencia?', botones)
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
