import { Component, effect, inject, signal, Signal, ViewChild } from '@angular/core';
import { RouterModule} from '@angular/router';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { CalendarioService } from '../../Services/calendario.service';
import { CalendarioCardComponent } from "../../Shared/calendario-card/calendario-card.component";
import { FormsModule } from '@angular/forms';
import { supabase } from '../../app.config';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { TarjetaUsuarioComponent } from "../../Shared/tarjeta-usuario/tarjeta-usuario.component";

@Component({
  selector: 'app-principal',
  imports: [RouterModule, CalendarioCardComponent, FormsModule, MatTableModule, MatPaginatorModule, MatButtonModule, TarjetaUsuarioComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {


  private calendarioService = inject(CalendarioService);
  private autenticacionService = inject(AutenticacionService);

  calendarios = signal<{ id: string; nombre: string }[]>([]);
  perfil = this.autenticacionService.perfilSignal
  jugadores = signal<any>(null)
  tipoRanking: string = 'general';
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['posicion', 'nombre', 'puntuacion'];
  idBuscado = signal<any>(null)
  mostrarUsuario = signal<boolean>(false);
  loading = signal<boolean>(false)

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

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
    this.loading.set(true)
    const inicio = Date.now();

    if (tipo === 'general') {
      this.cargarRankingGeneral()
    } else {
      this.cargarRankingComunidad()
    }
    const duracion = Date.now() - inicio;
    const espera = Math.max(500 - duracion, 0);
    setTimeout(() => this.loading.set(false), espera);
  }
  async cargarRankingGeneral() {
  const { data, error } = await supabase
    .from('usuario')
    .select('id,nombre, apellidos, puntuacion')
    .order('puntuacion', { ascending: false });

  if (error) {
    console.error('Error al obtener el ranking:', error);
  } else {
    console.log(data);
    this.jugadores.set(data);
    this.dataSource.data = data ?? [];
  }
}

async cargarRankingComunidad() {
  const idComunidad = this.perfil().comunidad.id;
  const { data, error } = await supabase
    .from('usuario')
    .select(' id, nombre, apellidos, puntuacion')
    .eq('comunidad_id', idComunidad)
    .order('puntuacion', { ascending: false });

  if (error) {
    console.error('Error al obtener el ranking:', error);
  } else {
    console.log(data);
    this.jugadores.set(data);
    this.dataSource.data = data ?? [];
  }
}
encontrarUsuario(idUsuario:any){
  this.idBuscado = idUsuario;
  this.mostrarUsuario.set(true)
}
}
