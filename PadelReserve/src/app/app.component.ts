import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AutenticacionService } from './Services/autenticacion.service';
import { take } from 'rxjs';
import { supabase } from './app.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  cargando = signal(true);
private authService=inject(AutenticacionService) 
private router = inject(Router)

  constructor() {}

  async ngOnInit(): Promise<void> {
    await this.authService.recoverSession();
    const user = this.authService.perfil;
    if (user) {
      this.router.navigate(['/navbar/principal']);
    } 
    this.cargando.set(false);
  }
}
