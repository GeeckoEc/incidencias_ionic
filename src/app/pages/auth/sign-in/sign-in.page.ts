import { Component, OnInit } from '@angular/core';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  public titulo:      string = 'Iniciar Sesión'
  public correo:      string = ''
  public contrasena:  string = ''
  constructor(
    private servidor: ServerService,
    private notificar: NotifyService
  ) { }

  ngOnInit() {
  }

  async iniciarSesion (){
    let datos = {
      accion: 'prueba',
      correo: this.correo, 
      contrasena: this.contrasena
    }
    await this.servidor.enviar(datos, 'autenticar').subscribe(
      (datos: any) => {
        if (datos.estado == true) {
          this.notificar.notificarSimple(datos.mensaje)
        }
      }
    )
  }
}
