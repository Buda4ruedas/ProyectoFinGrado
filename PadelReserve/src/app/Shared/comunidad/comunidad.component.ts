import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-comunidad',
  imports: [CommonModule],
  templateUrl: './comunidad.component.html',
  styleUrl: './comunidad.component.css'
})
export class ComunidadComponent {
  @Input() comunidad!: {
    id: string;
    nombre: string;
    direccion: string;
    poblacion: string;
    provincia: string;
    seguridad: 'publica' | 'privada';
  };

  @Output() unirse = new EventEmitter<any>();

  onUnirse() {
    this.unirse.emit(this.comunidad);
  }
}
