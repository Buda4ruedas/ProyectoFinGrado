import { Component, effect, inject, signal, Signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { TableModule } from 'primeng/table';
import { CalendarioService } from '../../Services/calendario.service';
import { SinRolComponent } from "../../Shared/sin-rol/sin-rol.component";
import { CalendarioCardComponent } from "../../Shared/calendario-card/calendario-card.component";
import { FormsModule } from '@angular/forms';
import { supabase } from '../../app.config';

@Component({
  selector: 'app-principal',
  imports: [RouterModule, CalendarioCardComponent, FormsModule,TableModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {


  private calendarioService = inject(CalendarioService);
  private autenticacionService = inject(AutenticacionService);

  calendarios = signal<{ id: string; nombre: string }[]>([]);
  perfil = this.autenticacionService.perfilSignal
  jugadores = signal<any>(null)
  tipoRanking: string = 'general'

  constructor() {
    this.cargarCalendarios(this.perfil().comunidad.id);
    this.cargarRankingGeneral()
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
  cambiarRanking(tipo: string) {
    this.tipoRanking = tipo;
    if (tipo === 'general') {
      this.cargarRankingGeneral()
    } else {
      this.cargarRankingComunidad()
    }
  }
  async cargarRankingGeneral() {
    const { data, error } = await supabase
      .from('usuario')
      .select('nombre, apellidos, puntuacion')
      .order('puntuacion', { ascending: false });

    if (error) {
      console.error('Error al obtener el ranking:', error);
    } else {
      console.log(data)
      this.jugadores.set(data)
    }
  }
    async cargarRankingComunidad() {
      const idComunidad = this.perfil().comunidad.id
    const { data, error } = await supabase
      .from('usuario')
      .select('nombre, apellidos, puntuacion').eq('comunidad_id',idComunidad)
      .order('puntuacion', { ascending: false });

    if (error) {
      console.error('Error al obtener el ranking:', error);
    } else {
      console.log(data)
      this.jugadores.set(data)
    }
  }
}
