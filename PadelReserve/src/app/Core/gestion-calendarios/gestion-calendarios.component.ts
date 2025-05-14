import { Component, signal } from '@angular/core';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { CalendarioService } from '../../Services/calendario.service';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../Services/reservas.service';

@Component({
  selector: 'app-gestion-calendarios',
  imports: [FormsModule],
  templateUrl: './gestion-calendarios.component.html',
  styleUrl: './gestion-calendarios.component.css'
})
export class GestionCalendariosComponent {
  calendarios: any[] = [];
  horas: any = null;
  perfil = signal<any>(null);
  modoCreacion:boolean=false
  nuevoCalendario = {
  nombre: '',
  horaInicio: null,
  horaFin: null
};

  constructor(
    private autenticationService: AutenticacionService,
    private calendarioService: CalendarioService,
    private reservasService:ReservasService
  ) {
    this.autenticationService.profile$.subscribe(perfil => {
      if (perfil) this.perfil.set(perfil);
    });
  }

  async ngOnInit() {
    await this.obtenerCalendarios();
    this.horas = await this.reservasService.obtenerHorarios();
    console.log('las horas son ' , this.horas)
  }

  async obtenerCalendarios() {
    const comunidadId = this.perfil()?.comunidad?.id;
    if (!comunidadId) return;
    const calendarios = await this.calendarioService.obtenerCalendarios(comunidadId);
    this.calendarios = calendarios.map(c => ({
      ...c,
      editando: false
    }));
  }
  async eliminarCalendario(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este calendario?')) return;
    await this.calendarioService.eliminarCalendario(id);
    this.calendarios = this.calendarios.filter(c => c.id !== id);
  }

async guardarCalendario(calendario: any) {
  try {
    const horaInicio = calendario.horaInicio.id;
    const horaFin = calendario.horaFin.id;

    if (horaFin <= horaInicio) {
      alert('La hora fin debe ser posterior a la hora inicio');
      return;
    }

    await this.calendarioService.actualizarCalendario({
      id: calendario.id,
      nombre: calendario.nombre,
      hora_inicio: horaInicio,
      hora_fin: horaFin
    });
    calendario.editando = false;
  } catch (error) {
    console.error('Error guardando calendario:', error);
  }
}
  crearCalendario() {
  this.modoCreacion = true;
  const [primera, segunda] = this.horas;
  this.nuevoCalendario = {
    nombre: '',
    horaInicio: primera?.id || null,
    horaFin: segunda?.id || null
  };
}

cancelarCreacion() {
  this.modoCreacion = false;
  this.nuevoCalendario = {
    nombre: '',
    horaInicio: null,
    horaFin: null
  };
}

async guardarNuevoCalendario() {
  const comunidadId = this.perfil()?.comunidad?.id;
  if (!comunidadId) return;

  const { nombre, horaInicio, horaFin } = this.nuevoCalendario;

  if (!nombre || !horaInicio || !horaFin) {
    alert('Por favor completa todos los campos');
    return;
  }

  // Validar que horaFin no sea menor o igual que horaInicio
  if (horaFin <= horaInicio) {
    alert('La hora fin debe ser posterior a la hora inicio');
    return;
  }

  try {
    const nuevo = await this.calendarioService.crearCalendarios(comunidadId, this.nuevoCalendario);
    await this.obtenerCalendarios();
    this.cancelarCreacion();
  } catch (e) {
    console.error('Error creando calendario:', e);
    alert('Hubo un error al crear el calendario');
  }
}
}
