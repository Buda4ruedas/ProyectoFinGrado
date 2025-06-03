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

  private calendarioService = inject(CalendarioService);
  private autenticacionService = inject(AutenticacionService);

  calendarios = signal<{ id: string; nombre: string }[]>([]);
  perfil = this.autenticacionService.perfilSignal



  constructor() {
          this.cargarCalendarios(this.perfil().comunidad.id);
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
