import { Component, signal } from '@angular/core';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { ReservasService } from '../../Services/reservas.service';

@Component({
  selector: 'app-historico-reservas',
  imports: [],
  templateUrl: './historico-reservas.component.html',
  styleUrl: './historico-reservas.component.css'
})
export class HistoricoReservasComponent {
  data = signal<any>(null);
  userId:string =''

  constructor(private reservasService:ReservasService,private autenticacionService:AutenticacionService){
      this.autenticacionService.profile$.subscribe(perfil=>{
        if(perfil){
          this.userId = perfil.id
          this.cargarReservas()
        }
      })
  }

  async cargarReservas(){
    const datos = await this.reservasService.obtenerReservas(this.userId);
    const dia = new Date();
    this.data.set(datos);

  }



}
