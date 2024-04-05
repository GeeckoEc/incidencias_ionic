import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { ActionService } from 'src/app/services/action.service';
import { ConverterService } from 'src/app/services/converter.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-users-profile',
  templateUrl: './users-profile.page.html',
  styleUrls: ['./users-profile.page.scss'],
})
export class UsersProfilePage implements OnInit {

  informacion:          any
  cargando:             HTMLIonLoadingElement
  formulario:           FormGroup
  ocultarFormulario:    boolean = true

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
    this.cargarInformacion()
  }

  crearFormulario () {
    this.formulario = this.construir.group({
      correo:           ['',[Validators.required, Validators.email]],
      nombres:          ['',[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      apellidos:        ['',[Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      genero:           ['',[Validators.required]],
      fecha_nacimiento: ['',[Validators.required]],
      cedula:           ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      celular:          ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      direccion:        ['',[Validators.required, Validators.minLength(20), Validators.maxLength(300)]],
    })
  }

  async cargarInformacion() {
    this.cargando = await this.notificar.mensajeCargando('Cargando perfil...')
    let datos = {
      accion: 'informacion',
      correo: await this.almacenar.obtener('correo'),
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'usuarios').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          this.cargando.dismiss()
          return
        }
        this.informacion = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
        this.cargando.dismiss()
      }
    )
  }

  async editarPerfil () {
    this.cargando =  await this.notificar.mensajeCargando('Editando perfil...')
    let datos = {
      accion:           'editar',
      token:            await this.almacenar.obtener('token'),
      correo:           this.formulario.value.correo,
      nombres:          this.formulario.value.nombres,
      apellidos:        this.formulario.value.apellidos,
      genero:           this.formulario.value.genero,
      fecha_nacimiento: this.convertir.fechaParaSQL(this.formulario.value.fecha_nacimiento),
      cedula:           this.formulario.value.cedula,
      celular:          this.formulario.value.celular,
      direccion:        this.formulario.value.direccion,
    }
    await this.servidor.enviar(datos, 'usuarios').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          this.cargando.dismiss()
          return
        }
        this.notificar.notificarComplejo('Perfil', respuesta.mensaje, 'checkmark-circle-outline', 'success')
        this.almacenar.guardar('token', respuesta.token)
        this.ocultarFormulario  = true
        this.cargando.dismiss()
        this.cargarInformacion()
        return
      }
    )
  }

  salir () {
    this.irA.atras()
  }
}
