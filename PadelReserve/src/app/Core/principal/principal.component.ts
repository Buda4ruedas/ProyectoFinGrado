import { Component, signal, Signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AutenticacionService } from '../../Services/autenticacion.service';

import { CalendarioService } from '../../Services/calendario.service';
import { SinRolComponent } from "../../Shared/sin-rol/sin-rol.component";
import { CalendarioCardComponent } from "../../Shared/calendario-card/calendario-card.component";

@Component({
  selector: 'app-principal',
  imports: [RouterModule, CalendarioCardComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

calendarios = signal<{ id: string; nombre: string }[]>([]);
perfil = signal<any>(null);

 constructor(private calendarioService:CalendarioService,private autenticacionService:AutenticacionService){
  this.autenticacionService.profile$.subscribe( async perfil => {
    if (perfil) {
      this.perfil.set(perfil)
      if(perfil.comunidad){
        await this.calendarioService.obtenerCalendarios(perfil.comunidad.id)
        .then(calendarios => {
          this.calendarios.set(calendarios)
        });
      }
    
    }
  });
}
 

}

