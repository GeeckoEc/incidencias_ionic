import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';
import { StorageService } from 'src/app/services/storage.service';

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
    private almacenar: StorageService,
    private irA: NavigationService
  ) { }

  ngOnInit() {
    this.crearFormulario()
  }

  crearFormulario () {
    this.sesionForm = this.formulario.group({
      correo:     ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.minLength(8), Validators.maxLength(32)]]
    })
  }

  async iniciarSesion (){
    let datos = {
      accion:     'iniciarSesion',
      correo:     this.sesionForm.value.correo, 
      contrasena: this.sesionForm.value.contrasena
    }
    await this.servidor.enviar(datos, 'autenticar').subscribe(
      (datos: any) => {
        if (datos.estado == true) {
          this.notificar.notificarComplejo('Inicio de sesión: ',datos.mensaje, 'checkmark-circle-outline', 'success')
          this.almacenarSesion(datos) 
          this.irA.pagina('main-start')
        } else {
          this.notificar.notificarComplejo('Inicio de sesión: ',datos.mensaje, 'close-circle-outline', 'danger')
        }
      }
    )
  }

  async almacenarSesion (datos: any) {
    await this.almacenar.guardar('token', datos.token)
    await this.almacenar.guardar('nombres', datos.nombres)
    await this.almacenar.guardar('apellidos', datos.apellidos)
    await this.almacenar.guardar('rol', datos.rol)
    await this.almacenar.guardar('correo', this.sesionForm.value.correo)
  }

  recuperarContrasena () {
    this.irA.pagina('reset-password')
  }
}
