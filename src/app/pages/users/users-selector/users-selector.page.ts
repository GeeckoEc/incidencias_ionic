import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionService } from 'src/app/services/action.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-users-selector',
  templateUrl: './users-selector.page.html',
  styleUrls: ['./users-selector.page.scss'],
})
export class UsersSelectorPage implements OnInit {

  titulo:           string = 'Asignar Usuario'
  mensajeCargando:  HTMLIonLoadingElement
  listaUsuarios:    any
  formulario:       FormGroup
  idUsuario:        string = ''
  busqueda:         string = ''

  constructor(
    private irA: NavigationService,
    private notificar: NotifyService,
    private accion: ActionService,
    private servidor: ServerService,
    private almacenar: StorageService,
    private formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    await this.crearFormulario()
    await this.establecerPagina()
  }

  crearFormulario () {
    this.formulario = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      observaciones: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]]
    })
  }

  validarSesion (respuesta: any) {
    if (respuesta.sesion !== undefined) {
      this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
      this.irA.pagina('home')
      return
    }
  }

  async establecerPagina (){
    this.mensajeCargando  = await this.notificar.mensajeCargando('Verificando conexión...*')
    let datos = {
      accion:   'usuariosHabilitados',
      token:    await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'usuarios').subscribe(
      (respuesta: any) => {
        this.validarSesion(respuesta)
        this.almacenar.guardar('token', respuesta.token)
        this.listaUsuarios  = respuesta.datos
        this.mensajeCargando.dismiss()
        this.almacenar.guardar('token', respuesta.token)
        this.listaUsuarios  = respuesta.datos
        this.mensajeCargando.dismiss()
      }
    )
  }

  async seleccionarUsuario (correo: string) {
    if (this.formulario.value.usuario == '') {
      this.formulario.patchValue({
        usuario: correo
      })
    } else {
      this.formulario.patchValue({
        usuario: ''
      })
    }
  }

  async buscar (event: any) {
    let datos = {
      accion:   'buscar',
      buscar:   event.target.value,
      token:    await this.almacenar.obtener('token'),
      estado:   1
    }
    await this.servidor.enviar(datos, 'usuarios').subscribe(
      (respuesta: any) => {
        this.listaUsuarios  = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
        this.formulario.patchValue({
          usuario:  ''
        })
        this.mensajeCargando.dismiss()
      }
    )
  }

  async asignar () {
    let botones = [
      {
        text: 'Asignar',
        handler: () => {
          this.ejecutarAsignar()
        }
      }, 
      {
        text: 'Cancelar',
        role: 'cancel',
      }
    ]
    this.accion.mensajeAccion('Asignar', '¿Desea asignar este usuario a la incidencia?', botones)
  }

  async ejecutarAsignar () {
    this.mensajeCargando = await this.notificar.mensajeCargando('Asignando...')
    let datos = {
      accion:           'nuevo',
      usuario:          this.formulario.value.usuario,
      observaciones:    this.formulario.value.observaciones,
      incidencia:       await this.almacenar.obtener('idIncidencia'),
      token:            await this.almacenar.obtener('token'),
      estatus:          1
    }
    await this.servidor.enviar(datos, 'asignaciones').subscribe(
      (respuesta: any) => {
        if (respuesta.estado) {
          this.almacenar.guardar('token', respuesta.token)
          this.notificar.notificarComplejo('Asignación: ', respuesta.mensaje, 'checkmark-circle-outline', 'success')
          this.mensajeCargando.dismiss()
          this.irA.atras()
        } else {
          this.notificar.notificarComplejo('Asignación: ', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.mensajeCargando.dismiss()
        }
      }
    )
  }

  cancelar () {
    this.irA.atras()
  }
}
