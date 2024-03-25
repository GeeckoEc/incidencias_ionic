import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ActionService } from 'src/app/services/action.service';
import { ConverterService } from 'src/app/services/converter.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-incidents-form',
  templateUrl: './incidents-form.page.html',
  styleUrls: ['./incidents-form.page.scss'],
})
export class IncidentsFormPage implements OnInit {

  id:                 number    = 0
  titulo:             string    = 'Nueva'
  formulario:         FormGroup
  deshabilitarBoton:  boolean   = true
  listaPrioridades:   any

  constructor(
    private construir:  FormBuilder,
    private irA:        NavigationService,
    private almacenar:  StorageService,
    private notificar:  NotifyService,
    private accion:     ActionService,
    private servidor:   ServerService,
    private convertir:  ConverterService
  ) { }

  async ngOnInit() {
    await this.crearFormulario()
    await this.establerFormulario()
    await this.cargarPrioridades()
  }

  async establerFormulario () {
    let idTemporal  = await this.almacenar.obtener('idRegistro')
    if (idTemporal == null) {
      this.id = 0
      return
    }
    this.id         = idTemporal
    this.titulo     = 'Editar'
    await this.cargarDatos()
  }

  async cargarDatos () {
    let datos = {
      accion: 'cargar',
      id: this.id,
      token: await this.obtenerToken()
    }
    await this.servidor.enviar(datos, 'incidencias').subscribe(
      (respuesta: any) => {
        this.almacenarToken(respuesta.token)
        this.formulario.patchValue(respuesta.datos)
      }
    )
  }

  crearFormulario () {
    this.formulario = this.construir.group({
      asunto:       ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion:  ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      fecha:        ['', [Validators.required]],
      impacto:      ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      riesgos:      ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      prioridad:    ['', [Validators.required,]],
    })
  }

  async cargarPrioridades () {
    let datos = {
      accion: 'listaCompleta',
      token:  await this.obtenerToken()
    }
    await this.servidor.enviar(datos, 'prioridades').subscribe(
      (respuesta: any) => {
        this.almacenar.guardar('token', respuesta.token)
        this.listaPrioridades = respuesta.datos
      }
    )
  }

  async almacenarToken (token: string) {
    await this.almacenar.guardar('token', token)
  }

  async obtenerToken () {
    let datos = await this.almacenar.obtener('token')
    if (datos == null) {
      this.irA.pagina('home')
      return
    }
    return datos
  }

  async cancelar () {
    let botones = [
      {
        text: 'Si',
        role: 'destructive',
        handler: () => {this.irA.atras()}
      },
      {
        text: 'No',
        role: 'cancel'
      }
    ]
    await this.accion.presentActionSheet(this.titulo+' incidencia', '¿Desea cancelar la ' + this.titulo.toLowerCase() + ' incidencia? \nSe perderán los cambios.', botones)
  }

  async guardar () {
    let datos = {
      accion:       this.titulo.toLowerCase(),
      token:        await this.obtenerToken(),
      id:           this.id,
      asunto:       this.formulario.value.asunto,
      descripcion:  this.formulario.value.descripcion,
      fecha:        this.convertir.fechaParaSQL(this.formulario.value.fecha),
      impacto:      this.formulario.value.impacto,
      riesgos:      this.formulario.value.riesgos,
      prioridad:    this.formulario.value.prioridad,
    }
    await this.servidor.enviar(datos, 'incidencias').subscribe(
      (respuesta: any) => {
        if (respuesta !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
        }
        if (respuesta.estado == true) {
          this.notificar.notificarComplejo(this.titulo + ' Incidencia: ', respuesta.mensaje, 'checkmark-circle-outline', 'success')
          this.irA.atras()
        } else {
          this.notificar.notificarComplejo(this.titulo + ' Incidencia: ', respuesta.mensaje, 'close-circle-outline', 'danger')
          return
        }
      }
    )
  }
}
