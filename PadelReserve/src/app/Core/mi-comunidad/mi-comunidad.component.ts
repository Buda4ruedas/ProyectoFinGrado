import { Component, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { ComunidadService } from '../../Services/comunidad.service';
import { CalendarioService } from '../../Services/calendario.service';
import { CalendarioCardComponent } from '../../Shared/calendario-card/calendario-card.component';
import { UsuarioService } from '../../Services/usuario.service';
import { PopUpConfirmacionComponent } from '../../Shared/pop-up-confirmacion/pop-up-confirmacion.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-comunidad',
  imports: [CalendarioCardComponent],
  templateUrl: './mi-comunidad.component.html',
  styleUrl: './mi-comunidad.component.css'
})
export class MiComunidadComponent {

  @ViewChild('contenedorPopUp', { read: ViewContainerRef }) contenedorPopUp!: ViewContainerRef;

  comunidad: any = null;
  perfil = signal<any>(null);

  constructor(
    private autenticationService: AutenticacionService,
    private comunidadService: ComunidadService,
    private calendarioService: CalendarioService,
    private usuarioService: UsuarioService,
    private router:Router
  ) {
    this.autenticationService.profile$.subscribe(perfil => {
      this.perfil.set(perfil);
    });
  }

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
    const puede = await this.puedeAbandonar();
    console.log(puede)
    if (puede) {
      this.mostrarPopUpConfirmacion();
    } else {
      alert('No puedes abandonar la comunidad siendo el único administrador.');
    }
  }

  mostrarPopUpConfirmacion() {
    this.contenedorPopUp.clear();
    const ref = this.contenedorPopUp.createComponent(PopUpConfirmacionComponent);

    ref.instance.titulo = 'Abandonar Comunidad';
    ref.instance.subtitulo = 'Vas a abandonar tu comunidad actual';
    ref.instance.placeholder = '';

    ref.instance.close.subscribe(() => {
      ref.destroy();
    });

    ref.instance.confirmar.subscribe(async () => {
      console.log('Comunidad abandonada');
      await this.usuarioService.abandonarComunidad(this.perfil().id)
      this.router.navigate(['/navbar/principal'])
      ref.destroy();
    });
  }
}
