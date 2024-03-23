import { Component, OnInit } from '@angular/core';
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

  listaIncidencias: any[]   = []
  estado:           number  = 1

  constructor(
    private accion: ActionService,
    private irA: NavigationService,
    private notificar: NotifyService,
    private servidor: ServerService,
    private almacenar: StorageService,
  ) { }

  ngOnInit() {
  }

  cargarIncidencias () {
    let datos = {
      accion: 'lista',
      estado: this.estado
    }
    this.servidor.enviar(datos, 'incidencias').subscribe(
      (respuesta: any) => {
        this.listaIncidencias = respuesta.datos
        this.almacenar.guardar('token', respuesta.token)
    })
  }


}
