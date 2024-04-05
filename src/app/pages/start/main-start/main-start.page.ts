import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

/* IMPORTACIONES DE APEXCHARTS */
import { ApexTheme, ChartComponent } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexStroke,
  ApexLegend,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  stroke: ApexStroke;
  legend: ApexLegend;
  theme: ApexTheme
};
/* ====================================== */

@Component({
  selector: 'app-main-start',
  templateUrl: './main-start.page.html',
  styleUrls: ['./main-start.page.scss'],
})
export class MainStartPage implements OnInit {

  nombre:             string  = ''
  apellido:           string  = ''  
  rol:                string  = ''
  avatar:             string  = ''
  cargandoEjecutado:  boolean = false

  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any

  constructor(
    private irA: NavigationService,
    private almacenar: StorageService,
    private accion: ActionService,
    private servidor: ServerService,
    private notificar: NotifyService,
  ) {
    //const seriesData: ApexNonAxisChartSeries = [44, 55, 13, 43, 22];
    
  }

  async ngOnInit() {
    await this.establecerPagina()
    await this.graficoIncidencias()
  }

  async graficoIncidencias () { 
    let datos = {
      accion: 'conteoIncidenciasEstado',
      token:  await this.almacenar.obtener('token')
    }
    await this.servidor.enviar(datos, 'incidencias').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
          return
        }
        this.almacenar.guardar('token', respuesta.token)
        let etiquetas = ['Activas', 'Deshabilitadas', 'Terminadas']
        let series: number[] = [0, 0, 0]
        for(let fila of respuesta.datos) {
          let estado = parseInt(fila.estado)
          let cantidad = parseInt(fila.cantidad)
          series[estado]  = cantidad
        }
        this.chartOptions = {
          series: series,
          chart: {
            type: "donut"
          },
          theme: {
            mode: "dark",
          },
          stroke:{
            curve: "smooth",
            width: 3,
            colors: ["transparent"] // Color transparente o
          },
          labels: etiquetas,
          legend: {
            colors: ['#ffffff'], // Establece el color del texto de la leyenda
            markers: {
              width: 12,
              height: 12,
              strokeWidth: 0,
              strokeColor: '#fff',
              fillColors: undefined,
              radius: 12,
              customHTML: undefined,
              onClick: undefined,
              offsetX: 0,
              offsetY: 0
            },
            itemMargin: {
              vertical: 10,
              horizontal: 30
            }
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 350
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
      }
    )
    
  }

  async establecerPagina () {
    this.nombre               = await this.almacenar.obtener('nombres')
    this.nombre               = this.nombre.split(' ')[0]
    this.apellido             = await this.almacenar.obtener('apellidos')
    this.apellido             = this.apellido.split(' ')[0] 
    this.rol                  = await this.almacenar.obtener('rol')
    let png                   = ['girl', 'boy', 'other']
    let indiceAvatar: number  = parseInt(await this.almacenar.obtener('generoId')) - 1
    this.avatar = "../../../../assets/icon/"+ png[indiceAvatar] +".png"
  }

  irIncidencias () {
    this.irA.pagina('incidents-list')
  }

  irReportes () {
    this.irA.pagina('reports')
  }

  irUsuarios () {
    this.irA.pagina('users-list')
  }

  irPerfil () {
    this.irA.pagina('users-profile')
  }

  async cerrarSesion () {
    let botones = [
      {
        text: 'Cerrar sesión',	
        role: 'destructive',
        handler: () => {
          this.almacenar.limpiar()
          this.irA.pagina('home')
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel',
      }
    ]
    await this.accion.mensajeAccion('Cerrar sesión', '¿Desea cerrar la sesión?', botones)
  }
}
