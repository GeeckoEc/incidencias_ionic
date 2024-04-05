import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { ConverterService } from 'src/app/services/converter.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-incidences-summary',
  templateUrl: './incidences-summary.page.html',
  styleUrls: ['./incidences-summary.page.scss'],
})
export class IncidencesSummaryPage implements OnInit {
  incidencia: any;
  listaAsignados: any;
  listaActividades: any;
  mensajeCargando: HTMLIonLoadingElement;
  listaEstados: any = ['Deshabilitada', 'Activa', 'Terminada'];

  constructor(
    private irA: NavigationService,
    private almacenar: StorageService,
    private accion: ActionService,
    private servidor: ServerService,
    private notificar: NotifyService,
    public convertir: ConverterService
  ) { }

  async ngOnInit() {
    await this.cargarIncidencia();
    await this.cargarAsignados();
    await this.cargarActividades();
  }

  async cargarIncidencia() {
    this.mensajeCargando = await this.notificar.mensajeCargando(
      'Cargando incidencia...'
    );
    let datos = {
      accion: 'informacion',
      token: await this.almacenar.obtener('token'),
      id: await this.almacenar.obtener('idIncidencia'),
    };
    await this.servidor.enviar(datos, 'incidencias').subscribe((respuesta: any) => {
      if (respuesta.sesion !== undefined) {
        this.notificar.notificarComplejo(
          'Sesión',
          respuesta.mensaje,
          'close-circle-outline',
          'danger'
        );
        this.irA.pagina('home');
        this.mensajeCargando.dismiss();
        return;
      }
      this.incidencia = respuesta.datos;
      this.almacenar.guardar('token', respuesta.token);
      this.mensajeCargando.dismiss();
    });
  }

  async cargarAsignados() {
    this.mensajeCargando = await this.notificar.mensajeCargando('Cargando asignados...');
    let datos = {
      accion: 'listaEstado',
      estado: 1,
      token: await this.almacenar.obtener('token'),
    };
    await this.servidor.enviar(datos, 'asignaciones').subscribe((respuesta: any) => {
      if (respuesta.sesion !== undefined) {
        this.notificar.notificarComplejo(
          'Sesión',
          respuesta.mensaje,
          'close-circle-outline',
          'danger'
        );
        this.irA.pagina('home');
        this.mensajeCargando.dismiss();
        return;
      }
      if (respuesta.datos !== null) {
        this.listaAsignados = respuesta.datos;
      }
      this.mensajeCargando.dismiss();
    });
  }

  async cargarActividades() {
    this.mensajeCargando = await this.notificar.mensajeCargando('Cargando actividades...');
    let datos = {
      accion: 'listaIncidencia',
      incidencia: await this.almacenar.obtener('idIncidencia'),
      token: await this.almacenar.obtener('token'),
      estado: 1,
    };
    await this.servidor.enviar(datos, 'actividades').subscribe((respuesta: any) => {
      if (respuesta.sesion !== undefined) {
        this.notificar.notificarComplejo(
          'Sesión',
          respuesta.mensaje,
          'close-circle-outline',
          'danger'
        );
        this.irA.pagina('home');
        this.mensajeCargando.dismiss();
        return;
      }
      this.listaActividades = respuesta.datos;
      this.almacenar.guardar('token', respuesta.token);
      this.mensajeCargando.dismiss();
    });
  }

  imprimir () {
    window.print()
  }

  /* imprimir(title = "", subtitle = "") {
    let printer = window.open("", "PRINT", "height=600,width=800");
  if (printer) {
    printer.document.write("<html><head>");
    printer.document.write("<title>" + document.title + "</title>");
    printer.document.write("</head><body>");
    if (title && title.length > 0) {
      printer.document.write("<h2>" + title + "</h2>");
    }
    if (subtitle && subtitle.length > 0) {
      printer.document.write("<h3>" + subtitle + "</h3>");
    }
    printer.document.write("<div>" + document.body.innerHTML + "</div>");
    printer.document.write("</body></html>");
    printer.document.close();
    printer.focus();
    printer.print();
    printer.close();
  } else {
    console.error("No se pudo abrir la ventana de impresión.");
  }
  } */

  salir() {
    this.irA.atras();
  }
}
