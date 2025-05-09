import { Injectable } from '@angular/core';
import { AutenticacionService } from './autenticacion.service';
import { supabase } from '../app.config';
import { firstValueFrom, single } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  constructor(private authService: AutenticacionService) { }

  async modificarPerfil(datos: any): Promise<void> {
    const resp = await firstValueFrom(this.authService.profile$);

    if (!resp?.id) {
      console.error('No se ha encontrado el ID del usuario');
      throw new Error('ID de usuario no disponible');
    }

    const { data, error } = await supabase
      .from('usuario')
      .update(datos)
      .eq('id', resp.id)
      .select('*')
      .single();


    if (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
    console.log(data);
    console.log('Perfil actualizado correctamente');
    this.authService.loadProfile(data.id);
  }
  async modificarComunidadaUsuario(idComunidad: any, idUsuario: any, portal: string, piso: string) {
    const { data, error } = await supabase
      .from('usuario')
      .update({ comunidad_id: idComunidad, portal: portal, piso: piso,rol:null })
      .eq('id', idUsuario)
    if (error) {
      console.log('no se ha podido añadir la comunidad')
    } else {
      this.authService.loadProfile(idUsuario);
    }
  }
  async ponerRolAdministrador(idComunidad: any, idUsuario: any, portal: string, piso: string) {
    const { data, error } = await supabase
      .from('usuario')
      .update({ comunidad_id: idComunidad, portal: portal, piso: piso, rol: 'administrador' })
      .eq('id', idUsuario)

    if (error) {
      console.log('no se ha podido añadir el rol de administrador')
    }else{
      this.authService.loadProfile(idUsuario);
    }
  }

  async obtenerUsuariosSinVerificar(idComunidad: any): Promise<any> {
    const { data, error } = await supabase
      .from('usuario')
      .select('id,nombre,apellidos,email,portal,piso')
      .eq('comunidad_id', idComunidad)
      .is('rol', null)
    if (!error) {
      console.log('usuarios sin autenticar', data)
      return data;
    } else {
      console.log("no he podido conseguir los usuarios pendientes")
    }
  }
  async modificarRol(idUser: any, rol: any) {
    const { data, error } = await supabase
      .from('usuario')
      .update({ rol: rol })
      .eq('id', idUser)
    if (error) {
      console.log("no se ha podido asignar el rol")
    }else{
      
    }
  }
  async rechazarUsuario(idUser: any) {
    const { data, error } = await supabase
      .from('usuario')
      .update({ comunidad_id: null, portal: null, piso: null })
      .eq('id', idUser)
    if (error) {
      console.log("no se ha podido asignar el rol")
    }
  }




}
