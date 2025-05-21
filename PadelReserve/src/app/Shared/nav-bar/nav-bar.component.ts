import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterModule, } from '@angular/router';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule,CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
   autenticacionService = inject(AutenticacionService)
   router = inject(Router)
  perfil= this.autenticacionService.perfilSignal
  
 
  async cerrarSesion() {
    await this.autenticacionService.logout(); 
    this.router.navigate([''])
  }
}
