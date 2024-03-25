import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() { }

  fechaParaDatePicker (fecha: any) {
    fecha   = new Date(fecha)
    let par       = (i:number) => {return (i < 10) ? '0' + i : i}
    return fecha.getFullYear() + '-' + par(fecha.getMonth() + 1) + '-' + par(fecha.getDate()) + 'T' + par(fecha.getHours()) + ':' + par(fecha.getMinutes()) + 'Z'
  }

  fechaParaSQL (fecha: any) {
    fecha   = new Date(fecha)
    let par       = (i:number) => {return (i < 10) ? '0' + i : i}
    return fecha.getFullYear() + '-' +  par((fecha.getMonth() + 1)) + '-' + par(fecha.getDate()) + ' ' + par(fecha.getHours()) + ':' + par(fecha.getMinutes()) + ':' + par(fecha.getSeconds()) 
  }

  fechaLarga (fecha: any) {
    fecha     = new Date(fecha)
    let par   = (i:number) => {return (i < 10) ? '0' + i : i}
    let meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    let dias  = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    return dias[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getFullYear() + ', a las ' + par(fecha.getHours()) + ':' + par(fecha.getMinutes()) + ':' + par(fecha.getSeconds())
  }

  fechaCorta (fecha: any) {
    fecha     = new Date(fecha)
    let par       = (i:number) => {return (i < 10) ? '0' + i : i}
    let meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    return par(fecha.getDate()) + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getFullYear()
  }
}
