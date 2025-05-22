import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pop-up-codigo-comunidad',
  imports: [FormsModule],
  templateUrl: './pop-up-codigo-comunidad.component.html',
  styleUrl: './pop-up-codigo-comunidad.component.css'
})
export class PopUpCodigoComunidadComponent {
  codigo: string = '';  
  titulo = input <string>('');
  subtitulo=input<string>('');
  placeholder=input<string>('');
  @Output() cancelar = new EventEmitter<void>();  
  @Output() confirmar = new EventEmitter<string>();
  visible=false;

  closePopUp() {
    this.cancelar.emit();
    this.visible = false  
  }
  confirm() {
    this.confirmar.emit(this.codigo);
    this.visible = false
  }
}
