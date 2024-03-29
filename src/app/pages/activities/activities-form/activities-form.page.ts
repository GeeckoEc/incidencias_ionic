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

  mensajeCargando: HTMLIonLoadingElement
  formulario: FormGroup
  titulo: string = 'Nueva'
  listaEstatus: any


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
    await this.crearFormulario()
    await this.establecerPagina()
    await this.mensajeCargando.dismiss()
  }

  crearFormulario () {
    this.formulario = this.construirFormulario.group({
      inicio:       ['', [Validators.required]],
      fin:          ['', [Validators.required]],
      descripcion:  ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      estatus:      ['', [Validators.required,]],
    })
  }


  // REVISAR TODO ESTO
  async establecerPagina () {
    if (await this.almacenar.obtener('idActividad') !== undefined) {
      this.titulo = 'Editar'
      let idActividad = await this.almacenar.obtener('idActividad')
      let datos = {
        accion: 'obtener',
        token:  await this.almacenar.obtener('token'),
        id:     idActividad
      }
      await this.servidor.enviar(datos, 'actividades').subscribe(
        (respuesta: any) => {
          this.almacenar.guardar('token', respuesta.token)
          let actividad = respuesta.datos[0]
          this.formulario.patchValue({
            inicio:       this.convertir.fecha(actividad.inicio),
            fin:          this.convertir.fecha(actividad.fin),
            descripcion:  actividad.descripcion,
            estatus:      actividad.estatus,
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

}
