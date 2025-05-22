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

 // async ngAfterViewInit() {
 //   const perfil =  this.autenticacionService.perfilSignal();
 //   console.log("Perfil en ngAfterViewInit", perfil);
 //   if (perfil) {
 //     this.route.navigate(['navbar/principal']);
 //   }
 // }

  irRegistrarse() {
    this.mostrarRegistro.set(true)
  }
  irLogin() {
    this.mostrarLogIn.set(true)
  }

}
