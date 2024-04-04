import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, catchError, delayWhen, retry, timer, of, map, finalize} from 'rxjs';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  //private ipServer: string = '192.168.0.9'
  private ipServer: string = '192.168.0.10'
  //private ipServer: string = '192.168.18.26'
  //private ipServer: string = '192.168.68.137'
  private verificar: string = 'http://'+ this.ipServer + '/itil_server/controllers/enlinea.controller.php'

  constructor(
    private http: HttpClient, 
  ) { }

  enviar (datos: any, controlador: string) {
    let direccion: string = 'http://'+ this.ipServer +'/itil_server/controllers/' + controlador + '.controller.php'
    let opciones = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    return this.http.post(direccion, JSON.stringify(datos), opciones)
  }

  verificarServidor (): Observable<boolean> {
    let opciones = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    return this.http.post<any>(this.verificar, {accion: 'verificarSesion'}, opciones).pipe(
      map(response => response.estado),
      retry(1),
      delayWhen(() => timer(0, 5000)),
      catchError(() => of(false)),
    );
  }
}
