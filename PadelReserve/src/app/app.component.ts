import { Component, inject, signal, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { AutenticacionService } from './Services/autenticacion.service';
import { supabase } from './app.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cargando = signal(true);
  private authService = inject(AutenticacionService);
  private router = inject(Router);

  constructor() {}

   async ngOnInit(): Promise<void> {
    await this.authService.recoverSession();
    if(this.authService.perfilSignal()){
      if(this.authService.perfilSignal().nombre){
        this.router.navigate(['navbar/principal'])
      }else{
         this.router.navigate(['navbar/completarPerfil'])
      }
      
    }else{
      this.router.navigate([''])
    }
    this.cargando.set(false);
  }
}
