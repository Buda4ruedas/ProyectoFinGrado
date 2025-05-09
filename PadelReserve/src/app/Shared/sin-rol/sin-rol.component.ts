import { Component, signal } from '@angular/core';
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

constructor(private autenticacionService:AutenticacionService){
this.autenticacionService.profile$.subscribe(perfil=>{
  if(perfil.comunidad){
    this.pendienteAutenticar.set(true)
  }else{
    this.pendienteAutenticar.set(false)
  }
})
}
}
