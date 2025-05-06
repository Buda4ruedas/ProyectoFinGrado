import { Component } from '@angular/core';
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
  perfil$: Observable<any>;

  constructor(private authService: AutenticacionService) {
    this.usuario$ = this.authService.user$;
    this.perfil$ = this.authService.profile$;
  }

  cerrarSesion() {
    this.authService.logout(); 
  }
}
