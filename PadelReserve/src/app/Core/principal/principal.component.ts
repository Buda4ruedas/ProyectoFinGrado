import { Component, effect, inject, signal, Signal } from '@angular/core';
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
  private calendarioService = inject (CalendarioService)
  private autenticacionService = inject (AutenticacionService)

  constructor() {
    effect(() => {
      const perfilActual = this.autenticacionService.perfilSignal();
      if (perfilActual) {
        this.perfil.set(perfilActual);
        if (perfilActual.comunidad) {
          this.calendarioService
            .obtenerCalendarios(perfilActual.comunidad.id)
            .then((cals) => this.calendarios.set(cals));
        }
      }
    });
  }
}

