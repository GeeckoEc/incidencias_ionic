import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
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

  titulo:               string  = 'Incidencias Registradas'
  ocultarHabilitar:     boolean = true
  ocultarDeshabilitar:  boolean = false
  ocultarEditar:        boolean = false
  listaIncidencias:     any
  deshabilitarSliding:  boolean =  false
  estado:               number  = 1
  rolId:                number  = 0
  mensajeCargando:      HTMLIonLoadingElement
  accionLista:          string  = 'lista'
  listaEstados:         any    = [
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
    private accion: ActionService,
    private irA: NavigationService,
    private notificar: NotifyService,
    private servidor: ServerService,
    private almacenar: StorageService,
    private cargando: LoadingController,
  ) { }

  ngOnInit() {
    this.establecerPagina()
  }

  async establecerPagina () {
    this.rolId = parseInt(await this.almacenar.obtener('rolId'))
    let cambiarLista  =  [1, 3]
    if (!cambiarLista.includes(this.rolId)) {
      this.titulo = 'Mis Incidencias'
      this.accionLista = 'miLista'
    }
    await this.cargarIncidencias()
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
    this.mensajeCargando  = await this.notificar.mensajeCargando('Cargando incidencias...')
    let datos = {
      accion: this.accionLista,
      estado: this.estado,
      token:  await this.almacenar.obtener('token'),
      correo: await this.almacenar.obtener('correo'),
    }
    await this.servidor.enviar(datos, 'incidencias').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión:', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          this.mensajeCargando.dismiss()
          return
        }
        this.almacenar.guardar('token', respuesta.token)
        let cantidad = respuesta.datos
        let estadoSeleccionado  = this.listaEstados.findIndex((item:any) => item.id == this.estado)
        if (cantidad.length == 0) {
          this.listaIncidencias = [{
            asunto: 'No hay incidencias '+ this.listaEstados[estadoSeleccionado].nombre.toLowerCase() +'.',
            id: 0,
          }]
          this.deshabilitarSliding = true
        } else {
          this.listaIncidencias = respuesta.datos
          this.deshabilitarSliding = false
        }
        this.mensajeCargando.dismiss()
      }
    )
    this.cambiarEstado()
  }

  async nuevaIncidencia () {
    await this.almacenar.eliminar('idIncidencia')
    await this.irA.pagina('incidents-form')
  }

  cambiarEstado () {
    if (this.estado == 0) {
      this.ocultarDeshabilitar  = true
      this.ocultarEditar        = true
      this.ocultarHabilitar     = false
    } else if (this.estado == 1) {
      this.ocultarDeshabilitar  = false
      this.ocultarEditar        = false
      this.ocultarHabilitar     = true
    } else {
      this.ocultarDeshabilitar  = true
      this.ocultarEditar        = true
      this.ocultarHabilitar     = true
    }
  }

  async verIncidencia (id: number) {
    await this.almacenar.guardar('idIncidencia', id).then(
      () => {
        this.irA.pagina('incidents-info')
      }
    )
  }

  async editarIncidencia (id: number) {
    await this.almacenar.guardar('idIncidencia', id).then(
      (dato: any) => {
        this.irA.pagina('incidents-form')
      }
    )
  }

  habilitarIncidencia (id: string) {
    let botones = [
      {
        text: 'Habilitar',
        handler: async () => {
          let datos = {
            accion: 'habilitar',
            id: id,
            token:  await this.obtenerToken()
          }
          await this.servidor.enviar(datos, 'incidencias').subscribe(
            (respuesta:any) => {
              if (respuesta.estado) {
                this.notificar.notificarComplejo('Incidencia:', respuesta.mensaje, 'checkmark-circle-outline', 'success')
                this.cargarIncidencias()
              } else {
                this.notificar.notificarComplejo('Incidencia:', respuesta.mensaje, 'close-circle-outline', 'danger')
              }
            }
          )
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
    ]
    this.accion.mensajeAccion('Habilitar Incidencia', '¿Estás seguro de habilitar la incidencia?', botones)
  }

  deshabilitarIncidencia (id: string) {
    let botones = [
      {
        text: 'Deshabilitar',
        handler: async () => {
          let datos = {
            accion: 'deshabilitar',
            id: id,
            token:  await this.obtenerToken()
          }
          await this.servidor.enviar(datos, 'incidencias').subscribe(
            (respuesta:any) => {
              if (respuesta.estado) {
                this.notificar.notificarComplejo('Incidencia:', respuesta.mensaje, 'checkmark-circle-outline', 'success')
                this.cargarIncidencias()
              } else {
                this.notificar.notificarComplejo('Incidencia:', respuesta.mensaje, 'close-circle-outline', 'danger')
              }
            }
          )
        }
      }, 
      {
        text: 'Cancelar',
        role: 'cancel',
      }
    ]
    this.accion.mensajeAccion('Deshabilitar Incidencia', '¿Estás seguro de deshabilitar la incidencia?', botones)
  }

  async regresar () {
    await this.irA.atras()
  }
}
