import { Component, signal } from '@angular/core';
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
  partidosCreados = signal<any[]>([])
  partidosApuntados = signal<any[]>([])
  userId: string = ''
  vistaActiva='creados'
  loadingCreados = signal(true);
  loadingApuntados = signal(true);
  constructor(private partidosService: PartidosService, private autenticacionService: AutenticacionService) {
    this.autenticacionService.profile$.subscribe(respuesta => {
      this.userId = respuesta.id
    })
    
  }
async ngOnInit(){
  await this.obtenerPartidosCreados();
   await this.obtenerPartidosApuntados()
}



async obtenerPartidosCreados() {
  this.loadingCreados.set(true);

  const inicio = Date.now(); // marca el inicio
  const todosPartidos = await this.partidosService.obtenerPartidos();
  const partidos = todosPartidos
    .filter(partido => partido.usuario.id == this.userId)
    .map(partido => partido.id);
  this.partidosCreados.set(partidos);

  const duracion = Date.now() - inicio;
  const espera = Math.max(500 - duracion, 0); // espera lo que falte hasta 2s

  setTimeout(() => this.loadingCreados.set(false), espera);
}

async obtenerPartidosApuntados() {
  this.loadingApuntados.set(true);

  const inicio = Date.now();
  const todosPartidosApuntados = await this.partidosService.obtenerPartidosApuntado(this.userId);
  let idApuntados: any[] = [];
  todosPartidosApuntados.forEach(resp => {
    idApuntados.push(resp.id_partido);
  });
  const idsSoloApuntado = idApuntados.filter(id => !this.partidosCreados().includes(id));
  this.partidosApuntados.set(idsSoloApuntado);

  const duracion = Date.now() - inicio;
  const espera = Math.max(500 - duracion, 0);
  setTimeout(() => this.loadingApuntados.set(false), espera);
}
cambiarVista(vista: string) {
  this.vistaActiva = vista;

  if (vista === 'creados') {
    this.obtenerPartidosCreados();
  } else {
    this.obtenerPartidosApuntados();
  }
}
async onPartidoEliminado(partidoId: string) {

  await this.obtenerPartidosCreados();
}

}
