import { Component, effect, inject, signal } from '@angular/core';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { ReservasService } from '../../Services/reservas.service';

@Component({
  selector: 'app-historico-reservas',
  imports: [],
  templateUrl: './historico-reservas.component.html',
  styleUrl: './historico-reservas.component.css'
})
export class HistoricoReservasComponent {
  private reservasService= inject(ReservasService)
  private autenticacionService= inject(AutenticacionService)
  data = signal<any>(null);
  perfil = this.autenticacionService.perfilSignal

 async ngOnInit(){
    await this.cargarReservas()
  }



  async cargarReservas(){
    const datos = await this.reservasService.obtenerReservas(this.perfil().id);
    const dia = new Date();
    this.data.set(datos);

  }



}
