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

  private calendarioService = inject(CalendarioService);
  private autenticacionService = inject(AutenticacionService);

  constructor() {
    effect(() => {
      const perfilActual = this.autenticacionService.perfilSignal();
      if (perfilActual) {
        this.perfil.set(perfilActual);
        if (perfilActual.comunidad) {
          this.cargarCalendarios(perfilActual.comunidad.id);
        } else {
          this.calendarios.set([]);
        }
      }
    });
  }

  private async cargarCalendarios(comunidadId: string) {
    try {
      const cals = await this.calendarioService.obtenerCalendarios(comunidadId);
      this.calendarios.set(cals);
    } catch (error) {
      console.error('Error al cargar los calendarios:', error);
      alert('Hubo un problema al obtener los calendarios. Inténtalo más tarde.');
      this.calendarios.set([]);
    }
  }
}
