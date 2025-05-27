import { Component, effect, EventEmitter, input, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pop-up-confirmacion',
  imports: [FormsModule],
  templateUrl: './pop-up-confirmacion.component.html',
  styleUrl: './pop-up-confirmacion.component.css'
})
export class PopUpConfirmacionComponent { 
  titulo = input <string>('');
  subtitulo=input<string>('');
  @Output() cancelar = new EventEmitter<void>();  
  @Output() confirmar = new EventEmitter<string>();


  closePopUp() {
    this.cancelar.emit();
     
  }
  confirm() {
    this.confirmar.emit();

  }
}
