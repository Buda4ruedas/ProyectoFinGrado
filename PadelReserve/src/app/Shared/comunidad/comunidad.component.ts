import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, input, Input, Output, signal } from '@angular/core';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { UsuarioService } from '../../Services/usuario.service';

@Component({
  selector: 'app-comunidad',
  imports: [CommonModule],
  templateUrl: './comunidad.component.html',
  styleUrl: './comunidad.component.css'
})
export class ComunidadComponent {
  comunidad = input<{
    id: string;
    nombre: string;
    direccion: string;
    poblacion: string;
    provincia: string;
    seguridad: 'publica' | 'privada';
    fotografia:string;
  }>();
  coincide = signal<boolean>(false)
  private autenticacionService = inject(AutenticacionService)
  perfil = this.autenticacionService.perfilSignal
  @Output() unirse = new EventEmitter<any>();
  @Output() abandonar = new EventEmitter<any>();

  constructor(){
    effect(()=>{
      const perfil = this.perfil()
      this.coincide.set(perfil.comunidad?.id === this.comunidad()!.id);
    })
  }

  onUnirse() {
    this.unirse.emit(this.comunidad);
  }

  Onabandonar() {
    this.abandonar.emit()
  }

}
