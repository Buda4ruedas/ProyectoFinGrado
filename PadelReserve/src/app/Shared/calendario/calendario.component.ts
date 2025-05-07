import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReservasService } from '../../Services/reservas.service';
import { supabase } from '../../app.config';
import { ActivatedRoute } from '@angular/router';
import { AutenticacionService } from '../../Services/autenticacion.service';

@Component({
  selector: 'app-calendario',
  imports: [CommonModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent {
  calendarioId!: string;
  userId!: string;
  portal!:string;
  piso!:string;

  dias = this.obtenerDiasProximos(7);
  horarios = signal<{ id: string, hora: string }[]>([]);
  reservas = signal<{ [key: string]: { id_usuario: string,portal:string,piso:string } }>({});

  constructor(
    private route: ActivatedRoute,
    private authService: AutenticacionService,
    private reservaService: ReservasService
  ) {}

  async ngOnInit(): Promise<void> {
    this.calendarioId = this.route.snapshot.paramMap.get('id')!;
    this.authService.profile$.subscribe((perfil:any) => {
      if (perfil) {
        this.userId = perfil.id;
        this.portal = perfil.portal;
        this.piso = perfil.piso;
        this.cargarHorarios();
        this.cargarReservas();
      }
    });
    console.log(this.reservas())
  }

  async cargarHorarios() {
    const { data, error } = await supabase.from('horario').select('id,hora');
    if (!error) {
      this.horarios.set(data);
    } else {
      console.error('Error al cargar horarios', error);
    }
  }

  async cargarReservas() {
    const { data, error } = await supabase
      .from('reserva')
      .select('fecha, id_horario, id_usuario,usuario(piso,portal)')
      .eq('id_calendario', this.calendarioId);

    if (!error) {
      const reservasMap: { [key: string]: { id_usuario: string,portal:string,piso:string } } = {};
      data.forEach((r: any) => {
        const dia = new Date(r.fecha).toLocaleDateString('es-ES');
        reservasMap[`${dia}-${r.id_horario}`] = { id_usuario: r.id_usuario,portal:r.usuario.portal,piso:r.usuario.piso };
      });
      this.reservas.set(reservasMap);
    } else {
      console.error('Error al cargar reservas', error);
    }
  }

  obtenerDiasProximos(dias: number): string[] {
    const fechas: string[] = [];
    const hoy = new Date();
    for (let i = 0; i < dias; i++) {
      const nueva = new Date(hoy);
      nueva.setDate(hoy.getDate() + i);
      fechas.push(nueva.toLocaleDateString('es-ES'));
    }
    return fechas;
  }

  estaReservado(dia: string, horarioId: string): boolean {
    return !!this.reservas()[`${dia}-${horarioId}`];
  }

  esDeMiVivienda(dia: string, horarioId: string): boolean {
    const reserva = this.reservas()[`${dia}-${horarioId}`];
    return reserva?.portal === this.portal && reserva?.piso === this.piso;
  }

  async reservar(dia: string, horarioId: string,) {
    const [dd, mm, yyyy] = dia.split('/').map(Number);
    const diaReserva = `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  
    const horario = this.horarios().find(h => h.id === horarioId);
    if (!horario) return;
  
    const [hora, minutos] = horario.hora.split(':').map(Number);
  
  
    const fechaReserva = new Date(yyyy, mm - 1, dd, hora, minutos);
  
    const ahora = new Date();
    const dentroDe72Horas = new Date(ahora.getTime() + 144 * 60 * 60 * 1000);
  
    if (fechaReserva > dentroDe72Horas) {
      alert('No puedes reservar con más de 6 dias de antelación.');
      return;
    }
  
    if (fechaReserva < ahora) {
      alert('No puedes reservar en el pasado.');
      return;
    }
    const numeroReservas = await this.reservaService.cargarReservasPorVivienda(
      diaReserva,
      this.portal,
      this.piso,
      this.calendarioId
    );
    if (numeroReservas >= 4) {
      alert("No puedes reservar más de 2 horas por vivienda en un día");
      return;
    }
    const confirmado = window.confirm(`¿Confirmas tu reserva para el ${dia}?`);
    if (!confirmado) return;

    const fechaParts = dia.split('/');
    const fechaISO = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;

    const { error } = await supabase.from('reserva').insert({
      id_usuario: this.userId,
      id_horario: horarioId,
      id_calendario: this.calendarioId,
      fecha: fechaISO
    });

    if (!error) {
      await this.cargarReservas();
    } else {
      console.error('Error al hacer reserva:', error);
    }
  }
 async  onclick(dia:string , horarioId:string ){
    if(this.estaReservado(dia,horarioId)){
      if(this.esDeMiVivienda(dia,horarioId)){
        const confirmar = confirm("Estas seguro que quiere cancelar esta reserva")
        if(confirmar){
          const fechaParts = dia.split('/');
          const fechaISO = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;
          await this.reservaService.eliminarReserva(fechaISO,this.userId,this.calendarioId,horarioId);
          this.cargarReservas();
        }
     
      }
    }else{
      this.reservar(dia,horarioId)
    }


  }






}
