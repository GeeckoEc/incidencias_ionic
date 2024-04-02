import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { ConverterService } from 'src/app/services/converter.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-users-info',
  templateUrl: './users-info.page.html',
  styleUrls: ['./users-info.page.scss'],
})
export class UsersInfoPage implements OnInit {

  titulo:               string  = 'Información del Usuario'
  informacion:          any
  estadoUsuario:        string  = ''
  fechaNacimiento:      string  = ''
  fechaRegistro:        string  = ''
  mensajeCargando:      HTMLIonLoadingElement
  listaEstados:         any = ['Deshabilitado', 'Habilitado']

  constructor(
    private irA:        NavigationService,
    private almacenar:  StorageService,
    private notificar:  NotifyService,
    private accion:     ActionService,
    private servidor:   ServerService,
    private convertir:  ConverterService,
  ) { }

  ngOnInit() {
    this.cargarUsuario()
  }

  async cargarUsuario () {
    this.mensajeCargando  = await this.notificar.mensajeCargando('Cargando usuario...')
    let datos = {
      accion: 'informacion',
      token:  await this.almacenar.obtener('token'),
      correo: await this.almacenar.obtener('correoUsuario')
    }
    await this.servidor.enviar(datos, 'usuarios').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesion', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.mensajeCargando.dismiss()
          this.irA.pagina('home')
        }
        this.informacion = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
        this.fechaNacimiento  = this.convertir.fechaCorta(this.informacion.fecha_nacimiento)
        this.fechaRegistro  = this.convertir.fechaCorta(this.informacion.fecha_creacion)
        this.estadoUsuario    = this.listaEstados[this.informacion.estado]
        this.mensajeCargando.dismiss()
      }
    )
  }

  salir() {
    this.irA.atras()
  }
}
