import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  formulario:       FormGroup
  correo:           string    = ''
  mensajeCargando:  HTMLIonLoadingElement

  constructor(
    private irA:                  NavigationService,
    private notificar:            NotifyService,
    private servidor:             ServerService,
    private ConstruirFormulario:  FormBuilder
  ) { }

  ngOnInit() {
    this.crearFormulario()
  }

  crearFormulario () {
    this.formulario = this.ConstruirFormulario.group({
      correo:     ['', [Validators.required, Validators.email]]
    })

  }

  async resetearContrasena() {
    this.mensajeCargando  = await this.notificar.mensajeCargando('Reseteando contraseña...')
    let datos = {
      accion: 'resetear',
      correo: this.formulario.value.correo
    }
    await this.servidor.enviar(datos, 'usuarios').subscribe(
      (respuesta: any) => {
        if (respuesta.sesion !== undefined) {
          this.notificar.notificarComplejo('Sesión', respuesta.mensaje, 'close-circle-outline', 'danger')
          this.irA.pagina('home')
        }
        if (respuesta.estado == true) {
          this.notificar.notificarComplejo('Resetear contraseña', respuesta.mensaje, 'checkmark-circle-outline', 'success')
          this.irA.atras()
        } else {
          this.notificar.notificarComplejo('Resetear contraseña', respuesta.mensaje, 'close-circle-outline', 'danger')
        }
        this.mensajeCargando.dismiss()
      }
    )
  }

  cancelar () {
    this.irA.atras()
  }
}
