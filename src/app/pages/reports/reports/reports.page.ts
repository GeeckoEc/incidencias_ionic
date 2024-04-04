import { Component, OnInit } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  constructor(
    private irA:  NavigationService,
    private servidor: ServerService,
    private almacenar: StorageService,
    private accion: ActionService,
    private notificar: NotifyService,

  ) { }

  ngOnInit() {
  }

  irReporteIncidencia () {
    
  }
}
