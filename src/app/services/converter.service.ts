import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() { }
  
  private pad(num: number) {
    return (num < 10) ? '0' + num : num.toString();
  }

  fechaParaDatePicker (fecha: any) {
    fecha   = new Date(fecha)
    return fecha.getFullYear() + '-' + this.pad(fecha.getMonth() + 1) + '-' + this.pad(fecha.getDate()) + 'T' + this.pad(fecha.getHours()) + ':' + this.pad(fecha.getMinutes()) + 'Z'
  }

  fechaNacimientoParaDatePicker (fecha: any) {
    fecha   = new Date(fecha)
    return fecha.getFullYear() + '-' + this.pad(fecha.getMonth() + 1) + '-' + this.pad(fecha.getDate() + 1) + 'T' + this.pad(fecha.getHours()) + ':' + this.pad(fecha.getMinutes()) + 'Z'
  }

  fechaParaSQL (fecha: any) {
    fecha   = new Date(fecha)
    return fecha.getFullYear() + '-' +  this.pad((fecha.getMonth() + 1)) + '-' + this.pad(fecha.getDate()) + ' ' + this.pad(fecha.getHours()) + ':' + this.pad(fecha.getMinutes()) + ':' + this.pad(fecha.getSeconds()) 
  }

  fechaLarga (fecha: any) {
    fecha     = new Date(fecha)
    let meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    let dias  = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return dias[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getFullYear() + ', a las ' + this.pad(fecha.getHours()) + ':' + this.pad(fecha.getMinutes()) + ':' + this.pad(fecha.getSeconds())
  }

  fechaCorta (fecha: any) {
    fecha     = new Date(fecha)
    let meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    return this.pad(fecha.getDate()) + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getFullYear()
  }
}
