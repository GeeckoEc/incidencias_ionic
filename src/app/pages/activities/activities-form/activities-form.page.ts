import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionService } from 'src/app/services/action.service';
import { ConverterService } from 'src/app/services/converter.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-activities-form',
  templateUrl: './activities-form.page.html',
  styleUrls: ['./activities-form.page.scss'],
})
export class ActivitiesFormPage implements OnInit {

  mensajeCargando:    HTMLIonLoadingElement
  formulario:         FormGroup
  titulo:             string  = 'Nueva'
  listaEstatus:       any
  listaAsignaciones:  any


  constructor(
    private irA: NavigationService,
    private notificar: NotifyService,
    private accion: ActionService,
    private servidor: ServerService,
    private almacenar: StorageService,
    private construirFormulario: FormBuilder,
    private convertir: ConverterService,
  ) { }

  async ngOnInit() {
    this.mensajeCargando = await this.notificar.mensajeCargando('Cargando...')
    await this.cargarAsignaciones()
    await this.cargarEstatus()
    await this.crearFormulario()
    await this.establecerPagina()
    await this.mensajeCargando.dismiss()
  }

  crearFormulario () {
    this.formulario = this.construirFormulario.group({
      asignacion:   ['', [Validators.required]],
      inicio:       ['', [Validators.required]],
      fin:          ['', [Validators.required]],
      descripcion:  ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      estatus:      ['', [Validators.required,]],
    })
  }

  async establecerPagina () {
    let ahora = new Date()
    this.formulario.patchValue(
      {
        inicio:       this.convertir.fechaParaDatePicker(ahora),
        fin:          this.convertir.fechaParaDatePicker(ahora),
      }
    )
    if (await this.almacenar.obtener('idActividad') !== null) {
      this.titulo = 'Editar'
      let datos = {
        accion: 'cargar',
        token:  await this.almacenar.obtener('token'),
        id:     await this.almacenar.obtener('idActividad')
      }
      await this.servidor.enviar(datos, 'actividades').subscribe(
        (respuesta: any) => {
          this.almacenar.guardar('token', respuesta.token)
          this.formulario.patchValue({
            inicio:       this.convertir.fechaParaDatePicker(respuesta.fecha_inicio),
            fin:          this.convertir.fechaParaDatePicker(respuesta.fecha_fin),
            descripcion:  respuesta.descripcion,
            estatus:      respuesta.fk_estatus,
          })
        }
      )
    }
  }

  async cargarEstatus () {
    let datos = {
      accion: 'listaCompleta',
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'estatus').subscribe(
      (respuesta: any) => {
        this.listaEstatus = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
      }
    )
  }

  async cargarAsignaciones() {
    let datos = {
      accion:     'listaIncidencia',
      estado:     1,
      incidencia: await this.almacenar.obtener('idIncidencia'),
      token:      await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'asignaciones').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.sesion, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          return
        }
        this.listaAsignaciones  = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
      }
    )
  }

  async guardar () {
    let datos = {
      accion:       'nuevo',
      token:        await this.almacenar.obtener('token'),
      descripcion:  this.formulario.value.descripcion,
      inicio:       this.convertir.fechaParaSQL(this.formulario.value.inicio),
      fin:          this.convertir.fechaParaSQL(this.formulario.value.fin),
      estatus:      this.formulario.value.estatus,
      asignacion:   this.formulario.value.asignacion
    }
    await this.servidor.enviar(datos, 'actividades').subscribe(
      (respuesta: any) => {
        if (respuesta.estado) {
          this.notificar.notificarComplejo('Actividad', respuesta.mensaje, 'checkmark-circle-outline', 'success')
          this.almacenar.guardar('token', respuesta.token)
          this.irA.atras()
        } else {
          this.notificar.notificarComplejo('Actividad', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.almacenar.guardar('token', respuesta.token)
        }
      }
    )
  }

  cancelar () {
    this.irA.atras()
  }
}
