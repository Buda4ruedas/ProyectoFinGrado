import { Component, signal } from '@angular/core';
import { RouterModule, } from '@angular/router';
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
  usuario$: Observable<any>;
  perfil= signal<any>(null);

  constructor(private authService: AutenticacionService) {
    this.usuario$ = this.authService.user$;
     this.authService.profile$.subscribe(perfil=>{
      this.perfil.set(perfil)
     });
  }

  cerrarSesion() {
    this.authService.logout(); 
  }
}
