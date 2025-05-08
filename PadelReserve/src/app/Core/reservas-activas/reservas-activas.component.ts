import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
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
  userId:string =''

  constructor(private reservasService:ReservasService,private autenticacionService:AutenticacionService){
      this.autenticacionService.profile$.subscribe(perfil=>{
        if(perfil){
          this.userId = perfil.id
          this.cargarReservasActivas()
        }
      })
  }

  async cargarReservasActivas() {
    const datos = await this.reservasService.obtenerReservas(this.userId);
    const ahora = new Date();
  
    const reservasActivas = datos.filter(element => {
      // Combinar fecha y hora
      const fechaHoraStr = `${element.fecha}T${element.horario}:00`; // → "2025-05-08T17:00:00"
      const fechaCompleta = new Date(fechaHoraStr);
      
      return fechaCompleta > ahora;
    });
  
    this.data.set(reservasActivas);
  }



}
