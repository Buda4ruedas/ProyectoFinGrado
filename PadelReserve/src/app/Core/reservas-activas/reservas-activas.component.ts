import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ReservasService } from '../../Services/reservas.service';
import { AutenticacionService } from '../../Services/autenticacion.service';

@Component({
  selector: 'app-reservas-activas',
  imports: [CommonModule],
  templateUrl: './reservas-activas.component.html',
  styleUrl: './reservas-activas.component.css'
})
export class ReservasActivasComponent {
   data = signal<{ nombre: string; calendario: string; horario: string; fecha: string }[]>([]);
  private autenticacionService = inject(AutenticacionService);
  private reservasService = inject(ReservasService);

  perfil = this.autenticacionService.perfilSignal();

  async ngOnInit() {
    await this.cargarReservasActivas();
  }

  async cargarReservasActivas() {
    if (!this.perfil) {
      alert('No se ha podido obtener el perfil del usuario');
      return;
    }

    try {
      const datos = await this.reservasService.obtenerReservas(this.perfil.id);

      if (!datos) {
        alert('Error al obtener las reservas');
        console.error('Error al obtener reservas.');
        return;
      }

      const ahora = new Date();

      const reservasActivas = datos.filter((element) => {
        const fechaHoraStr = `${element.fecha}T${element.horario}:00`;
        const fechaCompleta = new Date(fechaHoraStr);
        return fechaCompleta > ahora;
      });

      this.data.set(reservasActivas);
    } catch (error) {
      alert('Ha ocurrido un error al cargar las reservas activas');
      console.error('Error al cargar reservas activas:', error);
      this.data.set([]);
    }
  }
}