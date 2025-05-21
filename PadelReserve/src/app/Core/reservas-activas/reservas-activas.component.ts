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
  data = signal<{nombre:string,calendario:string,horario:string,fecha:string}[]>([]);
  private autenticacionService = inject(AutenticacionService)
  private reservasService=inject(ReservasService)
  perfil = this.autenticacionService.perfilSignal

  constructor(){ this.cargarReservasActivas()}

  async cargarReservasActivas() {
    const datos = await this.reservasService.obtenerReservas(this.perfil().id);
    const ahora = new Date();
  
    const reservasActivas = datos.filter(element => {
      // Combinar fecha y hora
      const fechaHoraStr = `${element.fecha}T${element.horario}:00`;
      const fechaCompleta = new Date(fechaHoraStr);
      
      return fechaCompleta > ahora;
    });
  
    this.data.set(reservasActivas);
  }



}
