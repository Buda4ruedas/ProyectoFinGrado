import { Component, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { UsuarioService } from '../../Services/usuario.service';

@Component({
  selector: 'app-tarjeta-usuario',
  imports: [],
  templateUrl: './tarjeta-usuario.component.html',
  styleUrl: './tarjeta-usuario.component.css'
})
export class TarjetaUsuarioComponent {
private usuarioService = inject ( UsuarioService)
idUsuario = input<any>(null)
usuario = signal<any>(null)


constructor(){
  effect (()=>{
      const idUsuario = this.idUsuario();
     this.obtenerDatosUsuario(idUsuario);
  
  })
    
  
}
async obtenerDatosUsuario(idUsuario:any){
 this.usuario.set(await this.usuarioService.obtenerUsuario(idUsuario))
}



}
