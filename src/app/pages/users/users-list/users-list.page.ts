import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { ActionService } from 'src/app/services/action.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
})
export class UsersListPage implements OnInit {
  
  @ViewChild('busqueda') busqueda: IonInput

  titulo:               string = 'Usuarios'
  estado:               number  = 1
  mensajeCargando:      HTMLIonLoadingElement
  ocultarEditar:        boolean = false
  ocultarDeshabilitar:  boolean = false
  ocultarHabilitar:     boolean = true
  listaUsuarios:        any
  listaEstados:         any = [
    {id: 1, nombre: 'Habilitados', accion: 'usuariosHabilitados'},
    {id: 0, nombre: 'Deshabilitados', accion: 'usuariosDeshabilitados'},
  ]

  constructor(
    private irA:        NavigationService,
    private servidor:   ServerService,
    private almacenar:  StorageService,
    private notificar:  NotifyService,
    private accion:     ActionService,
  ) { }

  async ngOnInit() {
    this.cargarUsuarios()
  }

  async cargarUsuarios () {
    this.mensajeCargando  = await this.notificar.mensajeCargando('Cargando usuarios...')
    let datos = {
      accion: this.obtenerAccion(),
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'usuarios').subscribe(
      (respuesta:any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          this.mensajeCargando.dismiss()
        }
        if (respuesta.datos !== null) {
          this.almacenar.guardar('token', respuesta.token)
          this.listaUsuarios  = respuesta.datos
        } else {
          this.listaUsuarios  = [{
            correo: null,
            nombres: 'No hay usuarios',
            apellidos: ' deshabilitados.',
          }]
          this.almacenar.guardar('token', respuesta.token)
        }
        if (this.estado == 0) {
          this.ocultarEditar        = true
          this.ocultarDeshabilitar  = true
          this.ocultarHabilitar     = false
        }else {
          this.ocultarEditar        = false
          this.ocultarDeshabilitar  = false
          this.ocultarHabilitar     = true
        }
        this.mensajeCargando.dismiss()
      }
    )
  }

  nuevoUsuario () {
    this.almacenar.eliminar('correoUsuario')
    this.irA.pagina('users-form')
  }

  async infoUsuario (correo:string) {
    await this.almacenar.guardar('correoUsuario', correo).then(
      () => {
        this.irA.pagina('users-info')
      }
    )

  }

  async editarUsuario (correo:string) {
    await this.almacenar.guardar('correoUsuario', correo).then(
      () => {
        this.irA.pagina('users-form')
      }
    )
  }

  async deshabilitarUsuario (correo:string) {
    let botones = [
      {
        text: 'Deshabilitar',
        handler: async () => {
          this.mensajeCargando  = await this.notificar.mensajeCargando('Deshabilitando usuario...')
          let datos = {
            accion: 'deshabilitar',
            correo: correo,
            token:  await this.almacenar.obtener('token')
          }
          await this.servidor.enviar(datos, 'usuarios').subscribe(
            (respuesta:any) => {
              if (respuesta.sesion !== undefined) {
                this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
                this.irA.pagina('home')
                this.mensajeCargando.dismiss()
                return
              }
              if (respuesta.estado) {
                this.mensajeCargando.dismiss()
                this.notificar.notificarComplejo('Deshabilitar Usuario', respuesta.mensaje, 'checkmark-circle-outline', 'success')
                this.almacenar.guardar('token', respuesta.token)
                this.cargarUsuarios()

              } else {
                this.notificar.notificarComplejo('Deshabilitar Usuario', respuesta.mensaje, 'close-circle-outline', 'danger')
                this.almacenar.guardar('token', respuesta.token)
                this.mensajeCargando.dismiss()
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
    await this.accion.mensajeAccion('Deshabilitar Usuario', '¿Desea deshabilitar este usuario?', botones)
  }

  async habilitarUsuario (correo:string) {
    let botones = [
      {
        text: 'Habilitar',
        handler: async () => {
          this.mensajeCargando = await this.notificar.mensajeCargando('Habilitando usuario...')
          let datos = {
            accion: 'habilitar',
            correo: correo,
            token:  await this.almacenar.obtener('token')
          }
          await this.servidor.enviar(datos, 'usuarios').subscribe(
            (respuesta:any) => {
              if (respuesta.sesion !== undefined) {
                this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
                this.irA.pagina('home')
                this.mensajeCargando.dismiss()
                return
              }
              if (respuesta.estado) {
                this.mensajeCargando.dismiss()
                this.notificar.notificarComplejo('Habilitar Usuario', respuesta.mensaje, 'checkmark-circle-outline', 'success')
                this.almacenar.guardar('token', respuesta.token)
                this.cargarUsuarios()
              } else {
                this.almacenar.guardar('token', respuesta.token)
                this.notificar.notificarComplejo('Habilitar Usuario', respuesta.mensaje, 'close-circle-outline', 'danger')
                this.mensajeCargando.dismiss()
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
    await this.accion.mensajeAccion('Habilitar Usuario', '¿Desea habilitar este usuario?', botones)
  }

  async buscar (buscar:any) {
    this.mensajeCargando = await this.notificar.mensajeCargando('Buscando usuarios...')
    let datos = {
      accion: 'buscar',
      buscar: buscar.target.value,
      estado: this.estado,
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'usuarios').subscribe(
      async (respuesta:any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          return
        }
        this.listaUsuarios = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
        this.mensajeCargando.dismiss()
        const input = await document.getElementById('busqueda')
        if (input) {
          input.click()
        }
        return
      }
    )
  }

  obtenerAccion () {
    interface Estados {
      id:     number,
      nombre: string,
      accion: string
    }
    return this.listaEstados.find((item:Estados) => item.id == this.estado).accion
  }

  salir () {
    this.irA.atras()
  }
}
