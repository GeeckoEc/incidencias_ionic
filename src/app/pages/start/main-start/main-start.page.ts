import { Component, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit() {
    this.cargarNombre()
  }

  async cargarNombre () {
    this.nombre = await this.almacenar.obtener('nombres')
    this.nombre = this.nombre.split(' ')[0]
  }
}
