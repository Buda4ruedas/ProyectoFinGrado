import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ReservasService } from '../../Services/reservas.service';
import { supabase } from '../../app.config';
import { ActivatedRoute } from '@angular/router';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { CalendarioService } from '../../Services/calendario.service';

@Component({
  selector: 'app-calendario',
  imports: [CommonModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent {
  private route = inject(ActivatedRoute);
  private autenticationService = inject(AutenticacionService);
  private reservaService = inject(ReservasService);
  private calendarioService = inject(CalendarioService);
  
  calendario = signal<any>(null);
  perfil = this.autenticationService.perfilSignal;
  semanaActual = signal(new Date());
  
  dias: Date[] = this.obtenerSemana(new Date());
  horario = signal<{ id: string, hora: string }[]>([]);
  horariosDiario = signal<{ id: string, hora: string }[]>([]);
  horariosFinde = signal<{ id: string, hora: string }[]>([]);
  reservas = signal<{ [key: string]: { id_usuario: string, portal: string, piso: string } }>({});

  async ngOnInit(): Promise<void> {
    let calendarioId = this.route.snapshot.paramMap.get('id')!;
    this.calendario.set(await this.calendarioService.obtenerCalendario(calendarioId));
    await this.cargarHorariosGenerico();
    await this.cargarHorariosFindes();
    await this.cargarReservas();
    this.obtenerRangoHorario()
  }

  async cargarHorariosGenerico() {
    console.log('el calendario es ', this.calendario());
    console.log(this.calendario().hora_inicio, this.calendario().hora_fin);
    const horas = await this.calendarioService.obtenerHorasCalendario(this.calendario().hora_inicio, this.calendario().hora_fin);
    this.horariosDiario.set(horas);
    console.log('estos son los horarios', this.horariosDiario());
  }
  async cargarHorariosFindes(){
    console.log('el calendario es ', this.calendario());
    console.log(this.calendario().hora_inicio_finde, this.calendario().hora_fin_finde);
    const horas = await this.calendarioService.obtenerHorasCalendario(this.calendario().hora_inicio_finde, this.calendario().hora_fin_finde);
    this.horariosFinde.set(horas);
    console.log('estos son los horarios', this.horariosFinde());
  }


  async cargarReservas() {
    const { data, error } = await supabase
      .from('reserva')
      .select('fecha, id_horario, id_usuario, usuario(piso, portal)')
      .eq('id_calendario', this.calendario().id);

    if (!error) {
      const reservasMap: { [key: string]: { id_usuario: string, portal: string, piso: string } } = {};
      data.forEach((r: any) => {
        const dia = new Date(r.fecha).toLocaleDateString('es-ES');
        reservasMap[`${dia}-${r.id_horario}`] = { id_usuario: r.id_usuario, portal: r.usuario.portal, piso: r.usuario.piso };
      });
      this.reservas.set(reservasMap);
    } else {
      console.error('Error al cargar reservas', error);
    }
  }

  
  obtenerLunes(fecha: Date): Date {
    const dia = fecha.getDay();
    const diff = (dia === 0 ? -6 : 1) - dia;
    const lunes = new Date(fecha);
    lunes.setDate(fecha.getDate() + diff);
    lunes.setHours(0, 0, 0, 0);
    return lunes;
  }

  
  obtenerSemana(fecha: Date): Date[] {
    const lunes = this.obtenerLunes(fecha);
    const semana: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      semana.push(dia);
    }
    return semana;
  }

  estaReservado(dia: Date, horarioId: string): boolean {
    const diaStr = dia.toLocaleDateString('es-ES');
    return !!this.reservas()[`${diaStr}-${horarioId}`];
  }

  esDeMiVivienda(dia: Date, horarioId: string): boolean {
    const diaStr = dia.toLocaleDateString('es-ES');
    const reserva = this.reservas()[`${diaStr}-${horarioId}`];
    return reserva?.portal === this.perfil().portal && reserva?.piso === this.perfil().piso;
  }

  async reservar(dia: Date, horarioId: string) {
    const diaStr = dia.toLocaleDateString('es-ES');
    const [dd, mm, yyyy] = diaStr.split('/').map(Number);
    const diaReserva = `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;

    const horario = this.horariosDiario().find(h => h.id === horarioId);
    if (!horario) return;

    const [hora, minutos] = horario.hora.split(':').map(Number);

    const fechaReserva = new Date(yyyy, mm - 1, dd, hora, minutos);

    const ahora = new Date();
    const dentroDe72Horas = new Date(ahora.getTime() + 144 * 60 * 60 * 1000);

    if (fechaReserva > dentroDe72Horas) {
      alert('No puedes reservar con más de 6 días de antelación.');
      return;
    }

    if (fechaReserva < ahora) {
      alert('No puedes reservar en el pasado.');
      return;
    }
    const numeroReservas = await this.reservaService.cargarReservasPorVivienda(
      diaReserva,
      this.perfil().portal,
      this.perfil().piso,
      this.calendario().id
    );
    if (numeroReservas >= 4) {
      alert("No puedes reservar más de 2 horas por vivienda en un día");
      return;
    }
    const confirmado = window.confirm(`¿Confirmas tu reserva para el ${diaStr}?`);
    if (!confirmado) return;

    const fechaISO = `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;

    const { error } = await supabase.from('reserva').insert({
      id_usuario: this.perfil().id,
      id_horario: horarioId,
      id_calendario: this.calendario().id,
      fecha: fechaISO
    });

    if (!error) {
      await this.cargarReservas();
    } else {
      console.error('Error al hacer reserva:', error);
    }
  }

  async onclick(dia: Date, horarioId: string) {
    const diaStr = dia.toLocaleDateString('es-ES');
    if (this.estaReservado(dia, horarioId)) {
      if (this.esDeMiVivienda(dia, horarioId)) {
        const confirmar = confirm("¿Estás seguro que quieres cancelar esta reserva?");
        if (confirmar) {
          const [dd, mm, yyyy] = diaStr.split('/').map(Number);
          const fechaISO = `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
          await this.reservaService.eliminarReserva(fechaISO, this.perfil().id, this.calendario().id, horarioId);
          this.cargarReservas();
        }
      }
    } else {
      this.reservar(dia, horarioId);
    }
  }
  semanaAnterior() {
  const fecha = new Date(this.semanaActual());
  fecha.setDate(fecha.getDate() - 7);
  this.semanaActual.set(fecha);
  this.dias = this.obtenerSemana(fecha);
}

semanaSiguiente() {
  const fecha = new Date(this.semanaActual());
  fecha.setDate(fecha.getDate() + 7);
  this.semanaActual.set(fecha);
  this.dias = this.obtenerSemana(fecha);
}
volverAHoy() {
  const hoy = new Date();
  this.semanaActual.set(hoy);
  this.dias = this.obtenerSemana(hoy);
}
esFinDeSemana(dia: Date): boolean {
  const d = dia.getDay();
  return d === 0 || d === 6;
}

async obtenerRangoHorario() {
  const horariosSemana = this.horariosDiario();
  const horariosFin = this.horariosFinde();

  if (horariosSemana.length === 0 && horariosFin.length === 0) {
    this.horario.set([]);
    return;
  }

  const todos = [...horariosSemana, ...horariosFin];

  const ids = todos.map(h => +h.id); // nos aseguramos de que sean números
  const idInicio = Math.min(...ids);
  const idFin = Math.max(...ids);
  this.horario = await this.calendarioService.obtenerHorasCalendario(idInicio, idFin); 

}
}