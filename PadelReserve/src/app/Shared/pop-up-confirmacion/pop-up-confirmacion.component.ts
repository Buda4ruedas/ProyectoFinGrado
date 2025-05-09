import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pop-up-confirmacion',
  imports: [FormsModule],
  templateUrl: './pop-up-confirmacion.component.html',
  styleUrl: './pop-up-confirmacion.component.css'
})
export class PopUpConfirmacionComponent { 
  @Input() titulo:string = '';
  @Input() subtitulo:string ='';
  @Input()placeholder:string ='';
  @Output() close = new EventEmitter<void>();  
  @Output() confirmar = new EventEmitter<string>();

  closePopUp() {
    this.close.emit();  
  }
  confirm() {
    this.confirmar.emit();
  }
}
