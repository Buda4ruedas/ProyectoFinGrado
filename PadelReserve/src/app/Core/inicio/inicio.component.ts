import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from "../login/login.component";
import { RegistrarseComponent } from "../registrarse/registrarse.component";

@Component({
  selector: 'app-inicio',
  imports: [RouterModule, LoginComponent, RegistrarseComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  mostrarLogIn = signal<boolean>(false)
  mostrarRegistro = signal<boolean>(false)

  irRegistrarse() {
    this.mostrarRegistro.set(true)
  }
  irLogin() {
    this.mostrarLogIn.set(true)
  }

}
