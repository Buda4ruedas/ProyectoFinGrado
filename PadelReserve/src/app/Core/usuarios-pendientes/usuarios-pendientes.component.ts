import { Component, effect, signal } from '@angular/core';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { UsuarioService } from '../../Services/usuario.service';

@Component({
  selector: 'app-usuarios-pendientes',
  imports: [],
  templateUrl: './usuarios-pendientes.component.html',
  styleUrl: './usuarios-pendientes.component.css'
})
export class UsuariosPendientesComponent {
  data = signal<any>(null);
  perfil = signal<any>(null)

  constructor(private autenticacionService: AutenticacionService, private usuarioService: UsuarioService) {
    effect(() => {
      const perfil = this.autenticacionService.perfilSignal()
      if (perfil) {
        this.perfil.set(perfil)
        this.cargarUsuariosPendientes()
      }
    })

  }

  async cargarUsuariosPendientes() {
    const usuarios = await this.usuarioService.obtenerUsuariosSinVerificar(this.perfil().comunidad.id)
    this.data.set(usuarios)
  }
  async rechazar(idUser: any) {
    await this.usuarioService.rechazarUsuario(idUser);
    this.cargarUsuariosPendientes()
  }
  async aceptar(idUser: any) {
    await this.usuarioService.modificarRol(idUser, 'usuario')
    this.cargarUsuariosPendientes()
  }
}
