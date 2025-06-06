import { inject, Injectable } from '@angular/core';
import { AutenticacionService } from './autenticacion.service';
import { supabase } from '../app.config';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private authService = inject(AutenticacionService)


  async modificarPerfil(datos: any): Promise<boolean> {
    try {
      const resp = this.authService.perfil;
      if (!resp?.id) {
        console.error('No se ha encontrado el ID del usuario');
        return false;
      }
      const { data, error } = await supabase
        .from('usuario')
        .update(datos)
        .eq('id', resp.id)
        .select('*')
        .single();

      if (error) throw error;

      console.log('Perfil actualizado correctamente', data);
      await this.authService.loadProfile(data.id);
      return true;
    } catch (e) {
      console.error('Error al actualizar perfil:', (e as Error).message);
      return false;
    }
  }

  async modificarComunidadaUsuario(idComunidad: any, idUsuario: any, portal: string, piso: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('usuario')
        .update({ comunidad_id: idComunidad, portal, piso, rol: null })
        .eq('id', idUsuario);
      if (error) throw error;
      await this.authService.loadProfile(idUsuario);
      return true;
    } catch (e) {
      console.error('No se ha podido añadir la comunidad:', (e as Error).message);
      return false;
    }
  }

  async ponerRolAdministrador(idComunidad: any, idUsuario: any, portal: string, piso: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('usuario')
        .update({ comunidad_id: idComunidad, portal, piso, rol: 'administrador' })
        .eq('id', idUsuario);
      if (error) throw error;
      await this.authService.loadProfile(idUsuario);
      return true;
    } catch (e) {
      console.error('No se ha podido añadir el rol de administrador:', (e as Error).message);
      return false;
    }
  }

  async obtenerUsuariosSinVerificar(idComunidad: any): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('id,nombre,apellidos,email,portal,piso')
        .eq('comunidad_id', idComunidad)
        .is('rol', null);
      if (error) throw error;
      console.log('Usuarios sin autenticar:', data);
      return data ?? [];
    } catch (e) {
      console.error('No he podido conseguir los usuarios pendientes:', (e as Error).message);
      return [];
    }
  }

  async modificarRol(idUser: any, rol: any): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .update({ rol })
        .eq('id', idUser)
        .select('*');
      if (error) throw error;
      console.log('Rol modificado:', data);
      return true;
    } catch (e) {
      console.error('No se ha podido asignar el rol:', (e as Error).message);
      return false;
    }
  }

  async rechazarUsuario(idUser: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('usuario')
        .update({ comunidad_id: null, portal: null, piso: null, rol: null })
        .eq('id', idUser);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('No se ha podido actualizar los campos a null:', (e as Error).message);
      return false;
    }
  }

  async abandonarComunidad(idUser: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('usuario')
        .update({ comunidad_id: null, portal: null, piso: null, rol: null })
        .eq('id', idUser);
      if (error) throw error;
      await this.authService.loadProfile(idUser);
      return true;
    } catch (e) {
      console.error('No se ha podido actualizar los campos a null:', (e as Error).message);
      return false;
    }
  }

  async obtenerUsuariosdeComunidad(idComunidad: any): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('comunidad_id', idComunidad);
      if (error) throw error;
      return data ?? [];
    } catch (e) {
      console.error('No se ha podido obtener los usuarios de esta comunidad:', (e as Error).message);
      return [];
    }
  }

  async obtenerCorreos(): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('usuario').select('email');
      if (error) throw error;
      return data ?? [];
    } catch (e) {
      console.error('No se ha podido obtener los correos:', (e as Error).message);
      return [];
    }
  }

  async usuarioYaRegistrado(email: any): Promise<boolean> {
    try {
      const usuarios = await this.obtenerCorreos();
      const existe = usuarios.find((resp: any) => resp.email === email);
      return !!existe;
    } catch (e) {
      console.error('Error verificando si usuario ya está registrado:', (e as Error).message);
      return false;
    }
  }

  async actualizarPuntuacion(puntuacion: any, id: any) {
    try {
      const { data, error } = await supabase.from("usuario").update([{ puntuacion: puntuacion }]).eq('id', id)
      if (error) {
        throw error
      }

    } catch (e) {
      console.log("error al actualizar la puntuacion")
    }
  }
  async obtenerUsuario(idUsuario: any): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('usuario').select('nombre,apellidos,comunidad(*),portal,piso,email,rol,puntuacion,fotografia').eq('id', idUsuario);
      if (error) {
        throw error
      } else {
        return data
      }
    } catch (e) {
      console.log("error al obtener informacion del usuario")
      return[]
    }
  }
}
