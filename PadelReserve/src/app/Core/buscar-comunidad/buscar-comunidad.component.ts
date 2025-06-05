import { Component, effect, inject, signal } from '@angular/core';
import { supabase } from '../../app.config';
import { CommonModule } from '@angular/common';
import { ComunidadComponent } from "../../Shared/comunidad/comunidad.component";
import { FormsModule } from '@angular/forms';
import { PopUpCodigoComunidadComponent } from '../../Shared/pop-up-codigo-comunidad/pop-up-codigo-comunidad.component';
import { UsuarioService } from '../../Services/usuario.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { PopUpConfirmacionComponent } from '../../Shared/pop-up-confirmacion/pop-up-confirmacion.component';
import { ComunidadService } from '../../Services/comunidad.service';
import { EnviarEmailsService } from '../../Services/enviar-emails.service';



@Component({
  selector: 'app-buscar-comunidad',
  imports: [CommonModule, ComunidadComponent, FormsModule, PopUpCodigoComunidadComponent, PopUpConfirmacionComponent],
  templateUrl: './buscar-comunidad.component.html',
  styleUrl: './buscar-comunidad.component.css'
})
export class BuscarComunidadComponent {
  private usuarioService = inject(UsuarioService)
  private autenticacionService = inject(AutenticacionService)
  private comunidadService = inject(ComunidadService)
  private enviarMailsService = inject(EnviarEmailsService)
 

  perfil = this.autenticacionService.perfilSignal;
  loading = signal<boolean>(true);
  comunidades = signal<any>(null);
  comunidadesFiltradas = signal<any>(null)
  mostrarCodigoPopUp = signal<boolean>(false);
  mostrarPortalPopUp = signal<boolean>(false);
  mostrarConfirmacionPopUp = signal<boolean>(false);

  filtro = '';
  
  codigo: string = '';
  comunidadSeleccionada: any;
  cambio = false
  portal: any
  piso: any

  async ngOnInit() {
    const comunidades = await this.comunidadService.obtenerComunidades()
    this.comunidades.set(comunidades)
    this.comunidadesFiltradas.set(comunidades)
    setTimeout(() => {
      this.loading.set(false);
    }, 500)
  }

  filtrar() {
    this.loading.set(true);
    setTimeout(() => {
      const f = this.filtro.toLowerCase();
      const resultados = this.comunidades().filter((c:any) =>
        c.nombre.toLowerCase().includes(f) ||
        c.direccion.toLowerCase().includes(f) ||
        c.poblacion.toLowerCase().includes(f) ||
        c.provincia.toLowerCase().includes(f)
      );
      this.comunidadesFiltradas.set(resultados);
      this.loading.set(false);
    }, 500);
  }

  async onUnirse(comunidad: any) {
    this.comunidadSeleccionada = comunidad;
    const puede = await this.puedeAbandonar(comunidad.id);
    if (puede) {
      if (this.comunidadSeleccionada.seguridad == 'privada') {
        this.mostrarCodigoPopUp.set(true);
      } else {
        this.mostrarPortalPopUp.set(true);
      }
    } else {
      alert('No puedes abandonar la comunidad siendo el único administrador.');
    }
  }

  async onAbandonar(comunidad: any) {
    const puede = await this.puedeAbandonar(comunidad.id);
    if (puede) {
      this.mostrarConfirmacionPopUp.set(true);
    } else {
      alert('No puedes abandonar la comunidad siendo el único administrador.');
    }
  }

  onConfirmarCodigo(codigo: string) {
    if (this.comunidadSeleccionada.codigo_acceso == codigo) {
      this.mostrarCodigoPopUp.set(false);
      this.mostrarPortalPopUp.set(true);
    } else {
      alert("El código es incorrecto.");
    }
  }

  async onConfirmarPortal(codigo: string) {
    if (!codigo.includes('-')) {
      alert('El formato debe ser "portal-piso", como "2-2B".');
      return;
    }

    const partes = codigo.split('-');
    if (partes.length !== 2 || !partes[0] || !partes[1]) {
      alert('Formato inválido. Debe ser algo como "2-2B".');
      return;
    }

    this.portal = partes[0].trim();
    this.piso = partes[1].trim();

    if (this.perfil().comunidad) {
      this.cambio = true;
      this.mostrarConfirmacionPopUp.set(true);
    } else {
      const unido = await this.unirseComunidad(this.portal, this.piso);
      if (!unido) alert('Hubo un error al unirse a la comunidad.');
    }

    this.mostrarPortalPopUp.set(false);
  }

  async unirseComunidad(portal: string, piso: string): Promise<boolean> {
    const ok = await this.usuarioService.modificarComunidadaUsuario(
      this.comunidadSeleccionada.id,
      this.perfil().id,
      portal,
      piso
    );
    if (!ok) {
      console.error('Error al unirse a la comunidad.');
    }
    this.enviarCorreo()
    return ok;
  }

  onCerrarPopup() {
    this.mostrarCodigoPopUp.set(false);
  }

  onCerrarPortalPopup() {
    this.mostrarPortalPopUp.set(false);
  }

  onCerrarConfirmacionPopup() {
    this.mostrarConfirmacionPopUp.set(false);
  }

  async onConfirmar() {
    const datos = { portal: null, piso: null, rol: null, comunidad_id: null };
    const actualizado = await this.usuarioService.modificarPerfil(datos);

    if (!actualizado) {
      alert('Error al abandonar la comunidad.');
       this.mostrarConfirmacionPopUp.set(false);
      return;
    }

    if (this.cambio) {
      const unido = await this.unirseComunidad(this.portal, this.piso);
      if (!unido) {
        alert('Error al unirse a la nueva comunidad.');
        return;
      }
      this.cambio = false;
    }

    this.mostrarConfirmacionPopUp.set(false);
  }

  async puedeAbandonar(idComunidad: any): Promise<boolean> {
    const administradores = await this.comunidadService.obtenerAdministradores(idComunidad);
    return !(this.perfil().rol === 'administrador' && administradores.length <= 1);
  }

async enviarCorreo() {
  const administradores = await this.comunidadService.obtenerAdministradores(this.comunidadSeleccionada.id);
  const mensaje = `Un usuario ha solicitado unirse a tu comunidad ${this.comunidadSeleccionada.nombre}`;
  const asunto = "Solicitud de Validación";

  this.enviarMailsService.enviarCorreoSolicitudValidacion(administradores, mensaje, asunto);
}

}
