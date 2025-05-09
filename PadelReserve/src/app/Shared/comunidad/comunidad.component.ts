import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { UsuarioService } from '../../Services/usuario.service';

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
  coincide=signal<boolean>(false)
  perfil=signal<any>(null)
  @Output() unirse = new EventEmitter<any>();
  @Output() abandonar = new EventEmitter<any>();


  constructor(private autenticacionService:AutenticacionService,private usuarioService:UsuarioService){  }

  ngOnInit(){
  this.obtenerCoincide();
  
  }
  obtenerCoincide(){
    this.autenticacionService.profile$.subscribe(perfil=>{
      this.perfil.set(perfil)
      if(perfil.comunidad?.id == this.comunidad.id){
        this.coincide.set(true)
        
      }else{
        this.coincide.set(false)
      }
    })
  }

  onUnirse() {
    this.unirse.emit(this.comunidad);
  }

  Onabandonar(){
    this.abandonar.emit()
  }

}
