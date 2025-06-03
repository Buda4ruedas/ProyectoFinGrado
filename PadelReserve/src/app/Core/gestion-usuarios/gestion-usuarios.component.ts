import { Component, effect, inject, signal } from '@angular/core';
import { UsuarioService } from '../../Services/usuario.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { ComunidadService } from '../../Services/comunidad.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-usuarios',
  imports: [],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent {
  usuarios: any[] = []
  private usuariosService = inject(UsuarioService)
  private autenticacionService = inject(AutenticacionService)
  private comunidadService = inject(ComunidadService)
  private route = inject (Router)
  perfil = this.autenticacionService.perfilSignal

  ngOnInit() {
    this.obtenerUsuarios();
  }

  async obtenerUsuarios() {
    try {
      this.usuarios = await this.usuariosService.obtenerUsuariosdeComunidad(this.perfil().comunidad.id);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      alert('Hubo un error al obtener los usuarios de la comunidad.');
    }
  }

  async cambiarRol(userId: any, rolActual: any) {
    try {
      const puede = await this.puedeAbandonar();
      if (rolActual === 'administrador') {
        if (puede) {
          await this.usuariosService.modificarRol(userId, 'usuario');
          if(this.perfil().id==userId){
            this.route.navigate(['navbar/principal'])
          }
          
        } else {
          alert("No se puede modificar el rol de este usuario porque es el único administrador.");
          return;
        }
      } else {
        await this.usuariosService.modificarRol(userId, 'administrador');
      }

      if (userId === this.perfil().id) {
        await this.autenticacionService.loadProfile(this.perfil().id);
      }

      await this.obtenerUsuarios();
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      alert('Ocurrió un error al cambiar el rol del usuario.');
    }
  }

  async eliminarUsuario(userId: any) {
    try {
      const puede = await this.puedeAbandonar();
      if (puede) {
        await this.usuariosService.rechazarUsuario(userId);
        await this.obtenerUsuarios();
      } else {
        alert("No se puede eliminar este usuario porque es el único administrador.");
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Hubo un error al intentar eliminar al usuario.');
    }
  }

  async puedeAbandonar(): Promise<boolean> {
    try {
      const administradores = await this.comunidadService.obtenerAdministradores(this.perfil().comunidad.id);
      
      return !(this.perfil().rol === 'administrador' && administradores.length <= 1);
    } catch (error) {
      console.error('Error al comprobar si puede abandonar:', error);
      alert('No se pudo verificar el estado de administradores.');
      return false;
    }
  }
}
