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

  
  private autenticationService= inject(AutenticacionService) 
  private comunidadService= inject(ComunidadService)
  private calendarioService = inject( CalendarioService)
  private usuarioService= inject(UsuarioService) 
  private router= inject(Router)
  comunidad: any = null;
  perfil = this.autenticationService.perfilSignal;
  popUpConfirmacion = signal(false)
  

 async ngOnInit() {
    try {
      const comunidadId = this.perfil().comunidad.id;

      this.comunidad = await this.comunidadService.obtenerComunidad(comunidadId);
      const numeroVecinos = await this.comunidadService.obtenerNumeroVecinos(comunidadId);
      const administradores = await this.comunidadService.obtenerAdministradores(comunidadId);
      const calendarios = await this.calendarioService.obtenerCalendarios(comunidadId);

      this.comunidad.numeroVecinos = numeroVecinos;
      this.comunidad.administradores = administradores;
      this.comunidad.calendarios = calendarios;

    } catch (error) {
      console.error("Error al cargar la comunidad:", error);
      alert("Hubo un error al cargar los datos de la comunidad.");
    }
  }

  async puedeAbandonar(): Promise<boolean> {
    try {
      const administradores = await this.comunidadService.obtenerAdministradores(this.perfil().comunidad.id);
      return !(this.perfil().rol === 'administrador' && administradores.length <= 1);
    } catch (error) {
      console.error("Error al verificar si puede abandonar:", error);
      alert("Hubo un error al verificar si puedes abandonar la comunidad.");
      return false;
    }
  }

  async abandonarComunidad() {
    try {
      const puede = await this.puedeAbandonar();
      if (!puede) {
        alert('No puedes abandonar la comunidad siendo el único administrador.');
        return;
      }
      this.popUpConfirmacion.set(true);
    } catch (error) {
      console.error("Error al intentar abandonar la comunidad:", error);
      alert("Hubo un error al intentar abandonar la comunidad.");
    }
  }

  onConfirmarAbandono = async () => {
    try {
      await this.usuarioService.abandonarComunidad(this.perfil().id);
      this.popUpConfirmacion.set(false);
      this.router.navigate(['/navbar/principal']);
    } catch (error) {
      console.error("Error al abandonar la comunidad:", error);
      alert("Hubo un error al abandonar la comunidad.");
    }
  };

  onCerrarPopup = () => {
    this.popUpConfirmacion.set(false);
  };
}
