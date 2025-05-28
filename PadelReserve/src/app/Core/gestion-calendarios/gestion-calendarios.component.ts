import { Component, effect, inject, signal } from '@angular/core';
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
  private autenticationService = inject(AutenticacionService)
  private calendarioService = inject(CalendarioService)
  private reservasService = inject(ReservasService)
  perfil = this.autenticationService.perfilSignal;
  modoCreacion: boolean = false;

  nuevoCalendario = {
    nombre: '',
    horaInicio: null,
    horaFin: null,
    horaInicioFinde: null,
    horaFinFinde: null
  };

  async ngOnInit() {
    try {
      await this.obtenerCalendarios();
      this.horas = await this.reservasService.obtenerHorarios();
    } catch (error) {
      console.error('Error al inicializar datos:', error);
      alert('Hubo un error al cargar los datos iniciales');
    }
  }

  async obtenerCalendarios() {
    const comunidadId = this.perfil()?.comunidad?.id;
    console.log('el id de la comunidad es', comunidadId);
    if (!comunidadId) return;

    try {
      const calendarios = await this.calendarioService.obtenerCalendarios(comunidadId);
      this.calendarios = calendarios.map(c => ({
        ...c,
        editando: false
      }));
    } catch (error) {
      console.error('Error al obtener calendarios:', error);
      alert('No se pudieron cargar los calendarios');
    }
  }

  async eliminarCalendario(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este calendario?')) return;

    try {
      await this.calendarioService.eliminarCalendario(id);
      this.calendarios = this.calendarios.filter(c => c.id !== id);
    } catch (error) {
      console.error('Error al eliminar calendario:', error);
      alert('No se pudo eliminar el calendario');
    }
  }

  async guardarCalendario(calendario: any) {
    try {
      const horaInicio = calendario.horaInicio.id;
      const horaFin = calendario.horaFin.id;
      const horaInicioFinde = calendario.horaInicioFinde.id;
      const horaFinFinde = calendario.horaFinFinde.id;

      if (horaFin <= horaInicio) {
        alert('La hora fin debe ser posterior a la hora inicio');
        return;
      }
      if (horaFinFinde <= horaInicioFinde) {
        alert('La hora fin de los findes de semana debe ser posterior a la hora inicio');
        return;
      }

      await this.calendarioService.actualizarCalendario({
        id: calendario.id,
        nombre: calendario.nombre,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        hora_inicio_finde: horaInicioFinde,
        hora_fin_finde: horaFinFinde
      });

      calendario.editando = false;
    } catch (error) {
      console.error('Error guardando calendario:', error);
      alert('No se pudo guardar el calendario');
    }
  }

  crearCalendario() {
    this.modoCreacion = true;
    const [primera, segunda, tercera, cuarta] = this.horas;
    this.nuevoCalendario = {
      nombre: '',
      horaInicio: primera?.id || null,
      horaFin: segunda?.id || null,
      horaInicioFinde: tercera?.id || null,
      horaFinFinde: cuarta?.id || null
    };
  }

  cancelarCreacion() {
    this.modoCreacion = false;
    this.nuevoCalendario = {
      nombre: '',
      horaInicio: null,
      horaFin: null,
      horaInicioFinde: null,
      horaFinFinde: null
    };
  }

  async guardarNuevoCalendario() {
    const comunidadId = this.perfil()?.comunidad?.id;
    if (!comunidadId) return;

    const { nombre, horaInicio, horaFin, horaInicioFinde, horaFinFinde } = this.nuevoCalendario;

    if (!nombre || !horaInicio || !horaFin || !horaInicioFinde || !horaFinFinde) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (horaFin <= horaInicio) {
      alert('La hora fin debe ser posterior a la hora inicio');
      return;
    }

    if (horaFinFinde <= horaInicioFinde) {
      alert('La hora fin de los findes de semana debe ser posterior a la hora inicio');
      return;
    }

    try {
      await this.calendarioService.crearCalendarios(comunidadId, this.nuevoCalendario);
      await this.obtenerCalendarios();
      this.cancelarCreacion();
    } catch (e) {
      console.error('Error creando calendario:', e);
      alert('Hubo un error al crear el calendario');
    }
  }
}
