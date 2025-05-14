import { Component, signal } from '@angular/core';
import { UsuarioService } from '../../Services/usuario.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { ComunidadService } from '../../Services/comunidad.service';

@Component({
  selector: 'app-gestion-usuarios',
  imports: [],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent {
  usuarios: any[] = []
  perfil = signal<any>(null)

  constructor(private usuariosService: UsuarioService, private autenticationService: AutenticacionService, private comunidadService: ComunidadService) {
    this.autenticationService.profile$.subscribe(perfil => {
      if (perfil) {
        this.perfil.set(perfil)
      }
    })
  }
  ngOnInit() {
    this.obtenerUsuarios()
  }
  async obtenerUsuarios() {
    this.usuarios = await this.usuariosService.obtenerUsuariosdeComunidad(this.perfil().comunidad.id)
    console.log('usuarios obtenidos ', this.usuarios)
  }
  async cambiarRol(userId: any, rolActual: any) {
    const puede = await this.puedeAbandonar()
    if (rolActual == 'administrador') {
      if (puede) {
        await this.usuariosService.modificarRol(userId, 'usuario')

      } else {
        alert("No se puede modificar el rol de este usuario porque es el unico administrador")
      }
    } else {
      console.log('paso')
      await this.usuariosService.modificarRol(userId, 'administrador')
    }
    if (userId == this.perfil().id) {
      await this.autenticationService.loadProfile(this.perfil().id)
    }
    await this.obtenerUsuarios()


  }
  async eliminarUsuario(userId: any) {
    const puede = await this.puedeAbandonar()
    if (puede) {
      await this.usuariosService.rechazarUsuario(userId)
      await this.obtenerUsuarios()
    } else {
      alert("No se puede eliminar este usuario porque es el unico admininstrador")
    }
  }
  async puedeAbandonar(): Promise<boolean> {
    const administradores = await this.comunidadService.obtenerAdministradores(this.perfil().comunidad.id);
    console.log(administradores, 'administradores :')
    return !(this.perfil().rol == 'administrador' && administradores.length <= 1);
  }

}
