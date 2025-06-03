import { Injectable } from '@angular/core';
import { supabase } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {

  async guardarUnpartido(datos: any, idUser: string): Promise<any> {
    try {
      const { data, error } = await supabase.from('partido').insert([{
        id_usuario_crea: idUser,
        fecha: datos.fecha,
        hora_inicio: datos.hora_inicio,
        hora_final: datos.hora_fin,
        nivel: datos.nivel,
        numero_jugadores: datos.jugadores,
        genero: datos.genero
      }]).select('id').single();

      if (error || !data) {
        console.error('Error al insertar partido:', error?.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error inesperado al guardar partido:', err);
      return null;
    }
  }

  async obtenerPartidos(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('partido')
        .select('id,usuario(id , nombre, comunidad:comunidad_id(id,nombre,direccion,poblacion)),fecha,hora_inicio,hora_final,resultado,nivel,genero,numero_jugadores')
        .order('fecha', { ascending: false })
        .order('hora_inicio', { ascending: false });

      if (error || !data) {
        console.error('Error al obtener partidos:', error?.message);
        return [];
      }
      return data;
    } catch (err) {
      console.error('Error inesperado al obtener partidos:', err);
      return [];
    }
  }

  async insertarEquipo(id_partido: string, id_user: string, equipo: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('jugadoresPartido')
        .insert([{ id_partido, id_participante: id_user, equipo }]);

      if (error) {
        console.error('No se ha podido insertar el jugador al equipo:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error inesperado al insertar jugador:', err);
      return false;
    }
  }

  async obtenerJugadoresPartido(idPartido: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('jugadoresPartido')
        .select('id,id_partido,usuario(id,nombre,puntuacion,fotografia),equipo')
        .eq('id_partido', idPartido)
        .order('equipo', { ascending: true });

      if (error || !data) {
        console.error('Error al obtener jugadores del partido:', error?.message);
        return [];
      }
      return data;
    } catch (err) {
      console.error('Error inesperado al obtener jugadores:', err);
      return [];
    }
  }

  async obtenerPartidosApuntado(idUser: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('vista_jugadores_partido')
        .select('*')
        .eq('id_participante', idUser)
        .order('fecha', { ascending: false })
        .order('hora_inicio', { ascending: false });

      if (error || !data) {
        console.error('Error al obtener partidos apuntados:', error?.message);
        return [];
      }
      return data;
    } catch (err) {
      console.error('Error inesperado al obtener partidos apuntados:', err);
      return [];
    }
  }

  async actualizarResultado(id: string, resultado: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('partido')
        .update({ resultado })
        .eq('id', id);

      if (error) {
        console.error('Error al actualizar resultado:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error inesperado al actualizar resultado:', err);
      return false;
    }
  }

  async eliminarPartido(partidoId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('partido')
        .delete()
        .eq('id', partidoId);

      if (error) {
        console.error('Error al eliminar partido:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error inesperado al eliminar partido:', err);
      return false;
    }
  }

}