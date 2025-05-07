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
  @Input() titulo:string = '';
  @Input() subtitulo:string ='';
  @Input()placeholder:string ='';
  @Output() close = new EventEmitter<void>();  
  @Output() confirmar = new EventEmitter<string>();

  closePopUp() {
    this.close.emit();  
  }

  confirm() {
    console.log(this.codigo)
    this.confirmar.emit(this.codigo);
  }
}
