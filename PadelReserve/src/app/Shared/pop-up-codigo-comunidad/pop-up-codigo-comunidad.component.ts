import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pop-up-codigo-comunidad',
  imports: [FormsModule],
  templateUrl: './pop-up-codigo-comunidad.component.html',
  styleUrl: './pop-up-codigo-comunidad.component.css'
})
export class PopUpCodigoComunidadComponent {
  codigo: string = '';  // Código que el usuario va a introducir
  @Output() close = new EventEmitter<void>();  // Evento para cerrar el modal
  @Output() confirmar = new EventEmitter<string>();  // Evento para enviar el código ingresado

  closePopUp() {
    this.close.emit();  
  }

  confirm() {
    console.log(this.codigo)
    this.confirmar.emit(this.codigo);
  }
}
