import { Component, effect, inject, Signal, signal, viewChild, ViewChild, ViewContainerRef } from '@angular/core';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { ComunidadService } from '../../Services/comunidad.service';
import { CalendarioService } from '../../Services/calendario.service';
import { CalendarioCardComponent } from '../../Shared/calendario-card/calendario-card.component';
import { UsuarioService } from '../../Services/usuario.service';
import { PopUpConfirmacionComponent } from '../../Shared/pop-up-confirmacion/pop-up-confirmacion.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-comunidad',
  imports: [CalendarioCardComponent,PopUpConfirmacionComponent],
  templateUrl: './mi-comunidad.component.html',
  styleUrl: './mi-comunidad.component.css'
})
export class MiComunidadComponent {

  @ViewChild('contenedorPopUp', { read: ViewContainerRef }) contenedorPopUp!: ViewContainerRef;
  private autenticationService= inject(AutenticacionService) 
  private comunidadService= inject(ComunidadService)
  private calendarioService = inject( CalendarioService)
  private usuarioService= inject(UsuarioService) 
  private router= inject(Router)
  comunidad: any = null;
  perfil = this.autenticationService.perfilSignal;
  private popUp: Signal<PopUpConfirmacionComponent> = viewChild.required(PopUpConfirmacionComponent)

  async ngOnInit() {
    this.comunidad = await this.comunidadService.obtenerComunidad(this.perfil().comunidad.id);
    const numeroVecinos = await this.comunidadService.obtenerNumeroVecinos(this.perfil().comunidad.id);
    const administradores = await this.comunidadService.obtenerAdministradores(this.perfil().comunidad.id);
    const calendarios = await this.calendarioService.obtenerCalendarios(this.perfil().comunidad.id);

    this.comunidad.numeroVecinos = numeroVecinos;
    this.comunidad.administradores = administradores;
    this.comunidad.calendarios = calendarios;

    console.log("los datos obtenidos son", this.comunidad);
  }
    async puedeAbandonar(): Promise<boolean> {
    const administradores = await this.comunidadService.obtenerAdministradores(this.perfil().comunidad.id);
    console.log(administradores,'administradores :')
    return !(this.perfil().rol == 'administrador' && administradores.length <= 1);
  }

   async abandonarComunidad() {
    const administradores = await this.comunidadService.obtenerAdministradores(this.perfil().comunidad.id);
    const puede = !(this.perfil().rol === 'administrador' && administradores.length <= 1);
    if (!puede) {
      alert('No puedes abandonar la comunidad siendo el único administrador.');
      return;
    }

    this.popUp().open(); 
  }

  onConfirmarAbandono = async () => {
    await this.usuarioService.abandonarComunidad(this.perfil().id);
    this.popUp().close();
    this.router.navigate(['/navbar/principal']);
  };

  onCerrarPopup = () => {
    this.popUp().close();
  };
}
