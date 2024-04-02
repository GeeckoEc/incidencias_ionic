import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionService } from 'src/app/services/action.service';
import { ConverterService } from 'src/app/services/converter.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.page.html',
  styleUrls: ['./users-form.page.scss'],
})
export class UsersFormPage implements OnInit {

  titulo:               string  = 'Nuevo'
  mensajeCargando:      HTMLIonLoadingElement
  formulario:           FormGroup
  deshabilitarCorreo:   boolean = false
  listaRoles:           any
  listaGeneros:         any

  constructor(
    private irA:        NavigationService,
    private servidor:   ServerService,
    private almacenar:  StorageService,
    private notificar:  NotifyService,
    private accion:     ActionService,
    private convertir:  ConverterService,
    private construir:  FormBuilder
  ) { }

  ngOnInit() {
    this.crearFormulario()
    this.establecerFormulario()
  }

  crearFormulario () {
    this.formulario = this.construir.group({
      correo:           ['', [Validators.required, Validators.email]],
      rol:              ['', [Validators.required]],
      nombres:          ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      apellidos:        ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      genero:           ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      cedula:           ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      celular:          ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      direccion:        ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    })
  }

  async establecerFormulario () {
    await this.cargarGeneros()
    await this.cargarRoles().then(
      () => {
        if (this.almacenar.obtener('correoUsuario') !== null) {
          this.cargarDatos()
        }
      }
    )
  }

  async cargarDatos () {
    this.mensajeCargando  = await this.notificar.mensajeCargando('Cargando usuario...')
    let datos = {
      accion: 'informacion',
      token:  await this.almacenar.obtener('token'),
      correo: await this.almacenar.obtener('correoUsuario')
    }
    await this.servidor.enviar(datos, 'usuarios').subscribe(
      (respuesta:any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión',respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          this.mensajeCargando.dismiss()
          return
        }
        this.formulario.patchValue({
          nombres: respuesta.datos.nombres,
          apellidos: respuesta.datos.apellidos,
          correo: respuesta.datos.correo,
          genero: respuesta.datos.id_genero,
          rol: respuesta.datos.id_rol,
          fecha_nacimiento: this.convertir.fechaNacimientoParaDatePicker(respuesta.datos.fecha_nacimiento),
          cedula: respuesta.datos.cedula,
          celular: respuesta.datos.celular,
          direccion: respuesta.datos.direccion,
        })
        this.titulo = 'Editar'
        this.deshabilitarCorreo = true
        this.mensajeCargando.dismiss()
      }
    )
  }

  async cargarRoles () {
    this.mensajeCargando = await this.notificar.mensajeCargando('Cargando roles...')
    let datos = {
      accion: 'listaCompleta',
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'roles').subscribe(
      (respuesta:any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          this.mensajeCargando.dismiss()
          return
        }
        //this.almacenar.guardar('token', respuesta.token)
        this.listaRoles = respuesta.datos
        this.mensajeCargando.dismiss()
      }
    )
  }

  async cargarGeneros () {
    this.mensajeCargando = await this.notificar.mensajeCargando('Cargando géneros...')
    let datos = {
      accion: 'listaCompleta',
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'generos').subscribe(
      (respuesta:any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.mensajeCargando.dismiss()
          this.irA.pagina('home')
          return
        }
        this.listaGeneros = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
        this.mensajeCargando.dismiss()
      }
    )
  }

  async guardar () {
    this.mensajeCargando  = await this.notificar.mensajeCargando('Guardando usuario...')
    let datos = {
      accion:           this.titulo.toLowerCase(),
      token:            await this.almacenar.obtener('token'),
      correo:           this.formulario.value.correo,
      rol:              this.formulario.value.rol,
      nombres:          this.formulario.value.nombres,
      apellidos:        this.formulario.value.apellidos,
      genero:           this.formulario.value.genero,
      fecha_nacimiento: this.convertir.fechaParaSQL(this.formulario.value.fecha_nacimiento),
      cedula:           this.formulario.value.cedula,
      celular:          this.formulario.value.celular,
      direccion:        this.formulario.value.direccion,
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
          this.notificar.notificarComplejo('Usuario', respuesta.mensaje, 'checkmark-circle-outline', 'success')
          this.irA.atras()
          this.mensajeCargando.dismiss()
          return
        } else {
          this.notificar.notificarComplejo('Usuario', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.mensajeCargando.dismiss()
          return
        }
      }
    )
  }

  mostrar ( ) {
    console.log(this.formulario.value)
  }

  cancelar () {
    let botones = [
      {
        text: 'Sí',
        handler: () => {
          this.irA.atras()
        }
      },
      {
        text: 'No',
        role: 'cancel',
      }
    ]
    this.accion.mensajeAccion(this.titulo + 'Usuario', '¿Desea salir el formulario? Los cambios se perderán.', botones)
  }
}
