import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-main-start',
  templateUrl: './main-start.page.html',
  styleUrls: ['./main-start.page.scss'],
})
export class MainStartPage implements OnInit {
  nombre: string  = ''
  constructor(
    private irA: NavigationService,
    private almacenar: StorageService,
    private accion: ActionService,
  ) { }

  ngOnInit() {
    this.cargarNombre()
  }

  async cargarNombre () {
    this.nombre = await this.almacenar.obtener('nombres')
    this.nombre = this.nombre.split(' ')[0]
  }

  irIncidencias () {
    this.irA.pagina('incidents-list')
  }

  irReportes () {
    this.irA.pagina('reports-list')
  }

  irUsuarios () {
    this.irA.pagina('users-list')
  }

  irConfiguracion () {
    this.irA.pagina('settings')
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
    await this.accion.presentActionSheet('Cerrar sesión', '¿Desea cerrar la sesión?', botones)
  }
}
