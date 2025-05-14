import { Component, inject, signal } from '@angular/core';
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
  perfil= signal<any>(null);
  router = inject(Router)
  authService = inject(AutenticacionService)
  constructor() {
     this.authService.profile$.subscribe(perfil=>{
      this.perfil.set(perfil)
     });
  }

  async cerrarSesion() {
    await this.authService.logout(); 
    this.router.navigate([''])
  }
}
