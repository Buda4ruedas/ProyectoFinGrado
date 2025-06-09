import { Component, effect, inject, signal } from '@angular/core';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { ReservasService } from '../../Services/reservas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historico-reservas',
  imports: [CommonModule],
  templateUrl: './historico-reservas.component.html',
  styleUrl: './historico-reservas.component.css'
})
export class HistoricoReservasComponent {
  private reservasService= inject(ReservasService)
  private autenticacionService= inject(AutenticacionService)
  data = signal<any>(null);
  perfil = this.autenticacionService.perfilSignal

   async ngOnInit() {
    await this.cargarReservas();
  }

  async cargarReservas() {
    try {
      const datos = await this.reservasService.obtenerReservas(this.perfil().id);
      this.data.set(datos);
    } catch (error) {
      console.error('Error al cargar las reservas:', error);
      alert('Ocurrió un error al cargar tu historial de reservas.');
    }
  }
}
