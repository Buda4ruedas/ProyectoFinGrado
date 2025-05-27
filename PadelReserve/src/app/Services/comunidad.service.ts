import { inject, Injectable } from '@angular/core';
import { supabase } from '../app.config';
import { UsuarioService } from './usuario.service';
import { CalendarioService } from './calendario.service';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {

 private usuarioService= inject( UsuarioService)
  private calendarioService= inject (CalendarioService)

  
  async crearComunidad(datos: any, userId: any, portal: any, piso: any): Promise<any> {
  try {
    const { data, error } = await supabase.from('comunidad')
      .insert([{
        nombre: datos.nombre,
        cp: datos.cp,
        poblacion: datos.poblacion,
        seguridad: datos.seguridad,
        direccion: datos.direccion,
        provincia: datos.provincia,
        codigo_acceso: datos.codigoAcceso,
        fotografia: datos?.fotografia
      }])
      .select('id');

    if (error || !data || !data[0]?.id) {
      console.error('Error al insertar comunidad:', error?.message);
      return null;
    }

    const idComunidad = data[0].id;

    
    const rolAsignado = await this.usuarioService.ponerRolAdministrador(idComunidad, userId, portal, piso);
    if (!rolAsignado) {
      await this.eliminarComunidad(idComunidad); // rollback
      console.error('Error al asignar rol de administrador. Comunidad eliminada.');
      return null;
    }

    for (let calendario of datos.calendarios) {
      const ok = await this.calendarioService.crearCalendarios(idComunidad, calendario);
      if (!ok) {
        await this.eliminarComunidad(idComunidad); // rollback
        console.error('Error al crear calendarios. Comunidad eliminada.');
        return null;
      }
    }

    return idComunidad;
  } catch (error) {
    console.error('Error inesperado al crear la comunidad:', error);
    return null;
  }
}

    async obtenerComunidad(idComunidad: any): Promise<any> {
    try {
      const { data, error } = await supabase.from('comunidad')
        .select('*')
        .eq('id', idComunidad)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error al obtener comunidad:', error);
      return null;
    }
  }

  async obtenerNumeroVecinos(idComunidad: any): Promise<number> {
    try {
      const { data, error } = await supabase.from('usuario')
        .select('id')
        .eq('comunidad_id', idComunidad);

      if (error || !data) return 0;
      return data.length;
    } catch (error) {
      console.error('Error al obtener número de vecinos:', error);
      return 0;
    }
  }

  async obtenerAdministradores(idComunidad: any): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('usuario')
        .select('nombre,email')
        .eq('comunidad_id', idComunidad)
        .eq('rol', 'administrador');

      if (error || !data) return [];
      return data.map(admin => ({
        nombre: admin.nombre,
        email: admin.email
      }));
    } catch (error) {
      console.error('Error al obtener administradores:', error);
      return [];
    }
  }

  async obtenerCalendarios(idComunidad: any): Promise<string[]> {
    try {
      const { data, error } = await supabase.from('calendario')
        .select('nombre')
        .eq('comunidad_id', idComunidad);

      if (error || !data) return [];
      return data.map(c => c.nombre);
    } catch (error) {
      console.error('Error al obtener calendarios:', error);
      return [];
    }
  }

  async eliminarComunidad(idComunidad: any): Promise<boolean> {
    try {
      const { error } = await supabase.from('comunidad')
        .delete()
        .eq('id', idComunidad);

      return !error;
    } catch (error) {
      console.error('Error al eliminar comunidad:', error);
      return false;
    }
  }

  async actualizarComunidad(idComunidad: any, datos: any): Promise<boolean> {
    try {
      const { error } = await supabase.from('comunidad')
        .update({
          nombre: datos.nombre,
          direccion: datos.direccion,
          cp: datos.cp,
          poblacion: datos.poblacion,
          seguridad: datos.seguridad,
          codigo_acceso: datos.codigoAcceso,
          fotografia: datos?.fotografia
        })
        .eq('id', idComunidad);

      return !error;
    } catch (error) {
      console.error('Error al actualizar comunidad:', error);
      return false;
    }
  }

  async obtenerComunidades(): Promise<any[] | null> {
    try {
      const { data, error } = await supabase.from('comunidad').select('*');
      if (error || !data) return null;
      return data;
    } catch (error) {
      console.error('Error al obtener comunidades:', error);
      return null;
    }
  }

  async actualizarFotoComunidad(idComunidad: any, url: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('comunidad')
        .update({ fotografia: url })
        .eq('id', idComunidad);

      return !error;
    } catch (error) {
      console.error('Error al actualizar la foto de la comunidad:', error);
      return false;
    }
  }
}