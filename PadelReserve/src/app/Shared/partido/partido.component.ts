import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartidosService } from '../../Services/partidos.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-partido',
  imports: [FormsModule],
  templateUrl: './partido.component.html',
  styleUrl: './partido.component.css'
})
export class PartidoComponent {
  @Input() partidoId: string = '';
  @Input() editable: boolean = false;
  datosPartido = signal<any>(null);
  userId: string = '';
  jugadoresPartido = signal<any[]>([]);
  equipo1 = signal<any[]>([]);
  equipo2 = signal<any[]>([]);
  cargado = false;
  resultado: any = null
  @Output() partidoEliminado = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute,
    private partidosService: PartidosService,
    private autenticacionService: AutenticacionService
  ) {
    this.autenticacionService.profile$.subscribe(resp => {
      this.userId = resp.id;
    });
  }

  ngOnInit() {

    if (!this.partidoId) {
      const idDesdeRuta = this.route.snapshot.paramMap.get('id');
      if (idDesdeRuta) {
        this.partidoId = idDesdeRuta;
        this.cargarPartido();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partidoId'] && this.partidoId && !this.cargado) {
      this.cargarPartido();
    }
  }

  private async cargarPartido() {
    await this.obtenerDatosPartido();
    await this.obtenerJugadoresPartido();
    this.cargado = true;
  }
  async obtenerDatosPartido() {

    const partidos = await this.partidosService.obtenerPartidos();


    const partido = partidos.find(p => p.id == this.partidoId);

    if (partido) {
      this.datosPartido.set(partido);
      this.resultado = this.datosPartido().resultado
    }
  }

  async obtenerJugadoresPartido() {
    const jugadores = await this.partidosService.obtenerJugadoresPartido(this.partidoId);
    this.jugadoresPartido.set(jugadores);

    if (this.datosPartido()?.numero_jugadores == 2) {
      const eq1 = jugadores.slice(0, 1);
      const eq2 = jugadores.slice(1, 2);
      this.equipo1.set([...eq1, ...Array(1 - eq1.length).fill(null)]);
      this.equipo2.set([...eq2, ...Array(1 - eq2.length).fill(null)]);
    } else {
      const eq1 = jugadores.filter(j => j.equipo === 1);
      const eq2 = jugadores.filter(j => j.equipo === 2);
      this.equipo1.set([...eq1, ...Array(2 - eq1.length).fill(null)]);
      this.equipo2.set([...eq2, ...Array(2 - eq2.length).fill(null)]);
    }

  }
  async aniadirEquipo(equipo: number) {
    const jugadorAsignado = this.jugadoresPartido().find(jugador => jugador.usuario.id === this.userId);
    if (jugadorAsignado) {
      console.log('El usuario ya está asignado al partido.');
      return;
    }
    await this.partidosService.insertarEquipo(this.partidoId, this.userId, equipo);
    await this.obtenerDatosPartido()
    await this.obtenerJugadoresPartido();
  }
  get setsResultado(): string[] {
    const resultado = this.datosPartido()?.resultado;
    if (!resultado) return [];
    return resultado.split('-'); 
  }

  puedeEditarResultado(): boolean {
    if (!this.editable || !this.datosPartido()) return false;

    const partido = this.datosPartido();


    const fechaPartido = new Date(partido.fecha);
    const [horaInicio, minutoInicio] = partido.hora_inicio.split(':');
    fechaPartido.setHours(parseInt(horaInicio), parseInt(minutoInicio));
    const ahora = new Date();
    const tresDiasDespues = new Date(fechaPartido);
    tresDiasDespues.setDate(tresDiasDespues.getDate() + 3);
    const fechaValida = ahora >= fechaPartido && ahora <= tresDiasDespues;
    const jugadoresCompletos = this.jugadoresPartido().length === partido.numero_jugadores;
    const resultadoYaDefinido = partido.resultado !== null;


    return fechaValida && jugadoresCompletos && !resultadoYaDefinido;
  }
  async guardarResultado() {
    const {valido,ganador} = this.validarResultado(this.resultado)
    if(valido){
      console.log('el ganador es el equipo ' , ganador)
      await this.partidosService.actualizarResultado(this.partidoId, this.resultado)
      this.cargarPartido()
    }else{
      console.log('el resultado introducido es invalido')
    }

  }
  validarSet(set: string): boolean {
    const regex = /^\d{1,2}\/\d{1,2}$/;  // Formato "6/4"
    if (!regex.test(set)) return false;
  
    const [score1, score2] = set.split('/').map(Number);
  
    // Comprobación de que el marcador no excede 7 juegos por set
    if (score1 > 7 || score2 > 7) {
      return false; // Un set no puede tener más de 7 juegos.
    }
  
    // Validar si un equipo tiene 7 juegos y el otro tiene 5 o 6
    if (score1 === 7 && (score2 === 5 || score2 === 6)) {
      return true;
    }
    if (score2 === 7 && (score1 === 5 || score1 === 6)) {
      return true;
    }
  
    // Validar sets con 6 juegos, donde el otro equipo tiene entre 0 y 5 juegos
    if (score1 === 6 && score2 <= 5) {
      return true;  // El equipo 1 ganó el set.
    }
    if (score2 === 6 && score1 <= 5) {
      return true;  // El equipo 2 ganó el set.
    }
  
    // No permitir sets con más de 6 juegos (excepto para los desempates 7/6 o 7/5)
    return false;
  }
  
  validarResultado(resultado: string): { valido: boolean, ganador: number | null } {
    const sets = resultado.split('-');
    
    if (sets.length < 2 || sets.length > 3) {
      return { valido: false, ganador: null };  // El partido debe tener entre 2 y 3 sets.
    }
  
    let equipo1 = 0;
    let equipo2 = 0;
  
    // Analizar los sets y contar los sets ganados por cada equipo.
    for (let set of sets) {
      if (!this.validarSet(set)) {
        return { valido: false, ganador: null };  // Si el set no es válido, retorna false.
      }
  
      const [score1, score2] = set.split('/').map(Number);
      if (score1 > score2) {
        equipo1++;
      } else if (score2 > score1) {
        equipo2++;
      }
    }
  
    // Determinar el ganador.
    if (equipo1 > equipo2) {
      return { valido: true, ganador: 1 };  // El equipo 1 ha ganado.
    } else if (equipo2 > equipo1) {
      return { valido: true, ganador: 2 };  // El equipo 2 ha ganado.
    }
  
    // Si ambos equipos tienen el mismo número de sets, el partido está empatado, lo cual no es válido.
    return { valido: false, ganador: null };
  }

  puedeEliminarPartido(): boolean {
    if (!this.editable || !this.datosPartido()) return false;
  
    const fechaPartido = new Date(this.datosPartido().fecha);
    const [horaInicio, minutoInicio] = this.datosPartido().hora_inicio.split(':');
    fechaPartido.setHours(parseInt(horaInicio), parseInt(minutoInicio));
  
    return new Date() < fechaPartido;
  }
  async eliminarPartido() {
    const confirmado = confirm('¿Estás seguro de que deseas eliminar este partido?');
    if (!confirmado) return;
  
    const { error } = await this.partidosService.eliminarPartido(this.partidoId);
  
    if (!error) {
      this.partidoEliminado.emit(this.partidoId);
     
    } else {
      console.error('Error al eliminar el partido', error);
      alert('Error al eliminar el partido');
    }
  }


}
