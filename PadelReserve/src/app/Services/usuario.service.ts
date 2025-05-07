import { Injectable } from '@angular/core';
import { AutenticacionService } from './autenticacion.service';
import { supabase } from '../app.config';
import { firstValueFrom, single } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  constructor(private authService: AutenticacionService) {}

  async modificarPerfil(datos: any): Promise<void> {
    const resp = await firstValueFrom(this.authService.profile$);

    if (!resp?.id) {
      console.error('No se ha encontrado el ID del usuario');
      throw new Error('ID de usuario no disponible');
    }

    const {data, error } = await supabase
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
  async modificarComunidad(idComunidad:any,idUsuario:any){
    const {data,error} = await supabase
    .from('usuario')
    .update({comunidad_id:idComunidad})
    .eq('id',idUsuario)
    if(error){
      console.log('no se ha podido añadir la comunidad')
    }else{
      this.authService.loadProfile(idUsuario);
    }
  }




}
