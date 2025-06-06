import { Component, effect, inject, signal } from '@angular/core';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { UsuarioService } from '../../Services/usuario.service';
import { EnviarEmailsService } from '../../Services/enviar-emails.service';

@Component({
  selector: 'app-usuarios-pendientes',
  imports: [],
  templateUrl: './usuarios-pendientes.component.html',
  styleUrl: './usuarios-pendientes.component.css'
})
export class UsuariosPendientesComponent {
  private autenticacionService = inject (AutenticacionService) 
  data = signal<any>(null);
  perfil = this.autenticacionService.perfilSignal
  enviarEmailService = inject (EnviarEmailsService)

  constructor( private usuarioService: UsuarioService) {
        this.cargarUsuariosPendientes()
  }

  async cargarUsuariosPendientes() {
    const usuarios = await this.usuarioService.obtenerUsuariosSinVerificar(this.perfil().comunidad.id)
    this.data.set(usuarios)
  }
  async rechazar(idUser: any) {
    await this.usuarioService.rechazarUsuario(idUser);
    const usuario = await this.usuarioService.obtenerUsuario(idUser)
    const titulo = "Autenticacion no Valida"
    const mensaje = "El administrador te ha denegado el acceso a su comunidad"
    console.log('el usuario es ' , usuario)
    this.enviarEmailService.enviarCorreoSolicitudValidacion(usuario,mensaje,titulo)
    this.cargarUsuariosPendientes()
    console.log("paso aqui rechazo")
  }
  async aceptar(idUser: any) {
    await this.usuarioService.modificarRol(idUser, 'usuario')
    const usuario = await this.usuarioService.obtenerUsuario(idUser)
    const titulo = "Autenticacion Valida"
    console.log('el usuario es ' , usuario)
    const mensaje = "El administrador te ha confirmado el acceso a su comunidad"
   try {
   this.enviarEmailService.enviarCorreoSolicitudValidacion(usuario, mensaje, titulo);
} catch (error) {
  console.error('Error al enviar correo:', error);
}
    this.cargarUsuariosPendientes()
     console.log("paso aqui acepto")
  }
}
