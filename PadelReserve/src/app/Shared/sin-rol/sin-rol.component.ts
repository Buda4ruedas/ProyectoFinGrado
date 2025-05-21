import { Component, effect, inject, signal } from '@angular/core';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sin-rol',
  imports: [RouterModule],
  templateUrl: './sin-rol.component.html',
  styleUrl: './sin-rol.component.css'
})
export class SinRolComponent {
pendienteAutenticar=signal<boolean>(false)
private  autenticationService = inject(AutenticacionService)

constructor(){
effect(()=>{
  const perfil = this.autenticationService.perfilSignal()
  if(perfil.comunidad?.id){
    this.pendienteAutenticar.set(true)
  }else{
    this.pendienteAutenticar.set(false)
  }
})

}

}
