import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  public titulo:      string = 'Iniciar Sesión'
  public sesionForm:  FormGroup
  public deshabilitarBoton: boolean = true

  constructor(
    private servidor: ServerService,
    private notificar: NotifyService,
    private formulario: FormBuilder,
  ) { }

  ngOnInit() {
    this.crearFormulario()
  }

  crearFormulario () {
    this.sesionForm = this.formulario.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.minLength(8), Validators.maxLength(32)]]
    })
  }

  async iniciarSesion (){
    let datos = {
      accion: 'prueba',
      /* correo: this.correo, 
      contrasena: this.contrasena */
    }
    await this.servidor.enviar(datos, 'autenticar').subscribe(
      (datos: any) => {
        if (datos.estado == true) {
          this.notificar.notificarSimple(datos.mensaje)
        }
      }
    )
  }

  recuperarContrasena () {

  }
}
