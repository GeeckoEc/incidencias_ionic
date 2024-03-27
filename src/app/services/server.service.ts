import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delayWhen, retry, timer, of, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  //private ipServer: string = '192.168.0.10'
  private ipServer: string = '192.168.18.26'
  private verificar: string = 'http://'+ this.ipServer + '/itil_server/controllers/enlinea.controller.php'

  constructor(
    private http: HttpClient
  ) { }

  enviar (datos: any, controlador: string) {
    let direccion: string = 'http://'+ this.ipServer +'/itil_server/controllers/' + controlador + '.controller.php'
    let opciones = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    return this.http.post(direccion, JSON.stringify(datos), opciones)
  }

  verificarServidor (): Observable <boolean> {
    let opciones = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    return this.http.post<any>(this.verificar, {accion: 'verificarSesion'}, opciones).pipe(
      map(response => response.estado),
      retry(3),
      delayWhen(() => timer(0, 5000)),
      catchError(() => {
        return of(false);
      })
    );
    /* return this.http.post<any>(this.verificar, {accion: 'verificarSesion'}).pipe(
      map(response => response.available), // Suponiendo que el objeto JSON devuelto tiene un campo "available" que indica si el servidor está disponible
      retry(3), // Intenta la solicitud hasta 3 veces
      delayWhen(() => timer(0, 5000)), // Espera 5 segundos antes de reintentar
      catchError(() => {
        return of(false); // Si hay un error, el servidor no está disponible
      })
    ); */
  }
}
