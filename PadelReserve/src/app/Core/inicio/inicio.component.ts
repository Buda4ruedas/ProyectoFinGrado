import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from "../login/login.component";
import { RegistrarseComponent } from "../registrarse/registrarse.component";
import { AutenticacionService } from '../../Services/autenticacion.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterModule, LoginComponent, RegistrarseComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  mostrarLogIn = signal<boolean>(false)
  mostrarRegistro = signal<boolean>(false)
  autenticacionService = inject (AutenticacionService)
  route = inject(Router)

  irRegistrarse() {
    this.mostrarRegistro.set(true)
  }
  irLogin() {
    this.mostrarLogIn.set(true)
  }

}
