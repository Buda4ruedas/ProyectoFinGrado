import { Component, effect, inject, signal } from '@angular/core';
import { PartidosService } from '../../Services/partidos.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { supabase } from '../../app.config';
import { PartidoComponent } from '../../Shared/partido/partido.component';

@Component({
  selector: 'app-mis-partidos',
  imports: [PartidoComponent],
  templateUrl: './mis-partidos.component.html',
  styleUrl: './mis-partidos.component.css'
})
export class MisPartidosComponent {
  private partidosService = inject( PartidosService)
  private autenticacionService = inject( AutenticacionService)

  partidosCreados = signal<any[]>([])
  partidosApuntados = signal<any[]>([])
  perfil = this.autenticacionService.perfilSignal
  vistaActiva='creados'
  loadingCreados = signal(true);
  loadingApuntados = signal(true);

async ngOnInit() {
  await this.obtenerPartidosCreados();
  await this.obtenerPartidosApuntados();
}

async obtenerPartidosCreados() {
  this.loadingCreados.set(true);
  const inicio = Date.now();

  try {
    const todosPartidos = await this.partidosService.obtenerPartidos();
    const partidos = todosPartidos
      .filter(partido => partido.usuario.id === this.perfil().id)
      .map(partido => partido.id);
    this.partidosCreados.set(partidos);
  } catch (error) {
    console.error("Error al obtener partidos creados:", error);
    alert("Hubo un error al cargar tus partidos creados.");
  } finally {
    const duracion = Date.now() - inicio;
    const espera = Math.max(500 - duracion, 0);
    setTimeout(() => this.loadingCreados.set(false), espera);
  }
}

async obtenerPartidosApuntados() {
  this.loadingApuntados.set(true);
  const inicio = Date.now();

  try {
    const todosPartidosApuntados = await this.partidosService.obtenerPartidosApuntado(this.perfil().id);
    const idApuntados = todosPartidosApuntados.map(resp => resp.id_partido);
    const idsSoloApuntado = idApuntados.filter(id => !this.partidosCreados().includes(id));
    this.partidosApuntados.set(idsSoloApuntado);
  } catch (error) {
    console.error("Error al obtener partidos apuntados:", error);
    alert("Hubo un error al cargar los partidos donde estás apuntado.");
  } finally {
    const duracion = Date.now() - inicio;
    const espera = Math.max(500 - duracion, 0);
    setTimeout(() => this.loadingApuntados.set(false), espera);
  }
}

cambiarVista(vista: string) {
  this.vistaActiva = vista;

  if (vista === 'creados') {
    this.obtenerPartidosCreados();
  } else {
    this.obtenerPartidosApuntados();
  }
}
}
