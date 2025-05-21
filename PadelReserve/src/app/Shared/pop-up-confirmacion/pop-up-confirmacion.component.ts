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
  @Output() cancelar = new EventEmitter<void>();  
  @Output() confirmar = new EventEmitter<string>();
  visible=false;

  closePopUp() {
    this.cancelar.emit();
    this.visible = false  
  }
  confirm() {
    this.confirmar.emit();
    this.visible = false
  }
  open(){
    this.visible=true
  }
  close(){
    this.visible = false
  }
}
