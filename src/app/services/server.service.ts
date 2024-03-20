import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(
    private http: HttpClient
  ) { }

  enviar (datos: any, controlador: string) {
    let direccion: string = 'http://192.168.0.10/itil_server/controllers/' + controlador + '.controller.php'
    let opciones = {headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
    return this.http.post(direccion, JSON.stringify(datos), opciones)
  }
}
