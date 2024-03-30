import { Component, OnInit } from '@angular/core';
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

  listaUsuarios:    any
  mensajeCargando:  HTMLIonLoadingElement
  buscar:           string = ''
  titulo:           string = 'Usuarios Registrados'
  estado:           string = '1'
  miCorreo:         string =  ''
  listaEstados:     any = [
    {id: 0, nombre: 'Deshabilitado', accion: 'usuariosDeshabilitados'},
    {id: 1, nombre: 'Habilitado', accion: 'usuariosHabilitados'}
  ]

  constructor(
    private irA:      NavigationService,
    private servidor: ServerService,
    private almacenar: StorageService,
    private notificar: NotifyService,
    private accion:    ActionService,
  ) { }

  async ngOnInit() {
    this.mensajeCargando = await this.notificar.mensajeCargando('Cargando...')
    await this.establecerPagina()
  }

  async establecerPagina () {
    this.miCorreo = await this.almacenar.obtener('correo')
    if ( await this.servidor.verificarServidor()) {
      this.cargarUsuarios()
    } else {
      setTimeout(() => {
        this.establecerPagina()
      }, 5000);
    }
  }

  async cargarUsuarios () {
    let datos = {
      accion: this.listaEstados[parseInt(this.estado)].accion,
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'usuarios').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.mensajeCargando.dismiss()
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          alert('Sesión terminada.')
          this.irA.pagina('home')
          return
        }
        this.mensajeCargando.dismiss()
        if (respuesta.datos == null) {
          this.listaUsuarios  = {
            id:       0,
            nombres:  'No hay usuarios registrados.',
            apellidos: '',
          }
        } else {
          this.listaUsuarios = respuesta.datos
        }
        this.almacenar.guardar('token', respuesta.token)
      }
    )
  }

  async busqueda () {

  }

  salir () {
    this.irA.atras()
  }
}
