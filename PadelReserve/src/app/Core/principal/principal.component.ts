import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CalendarioComponent } from '../../Shared/calendario/calendario.component';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { Observable } from 'rxjs';
import { CalendarioService } from '../../Services/calendario.service';

@Component({
  selector: 'app-principal',
  imports: [RouterModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

calendarios:{ id:string, nombre:string}[]=[];
perfil$ :Observable<any>;

constructor(private calendarioService:CalendarioService,private autenticacionService:AutenticacionService){
  this.perfil$ = this.autenticacionService.profile$;
  this.perfil$.subscribe(perfil => {
    if (perfil) {
      this.calendarioService.obtenerCalendarios(perfil.comunidad.id)
        .then(calendarios => {
          this.calendarios = calendarios;
        });
    }
  });
}
  


}

