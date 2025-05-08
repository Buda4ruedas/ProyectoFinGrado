import { Injectable } from '@angular/core';
import { supabase } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {

  constructor() { }

  async guardarUnpartido(datos: any, idUser: string): Promise<any> {

    const { data, error } = await supabase.from('partido').insert([
      {
        id_usuario_crea: idUser,
        fecha: datos.fecha,
        hora_inicio: datos.hora_inicio,
        hora_final: datos.hora_fin,
        nivel: datos.nivel,
        numero_jugadores: datos.jugadores,
        genero: datos.genero
      }
    ]).select('id').single()
    console.log(data)

    if (error) {
      console.log("Ha fallado la insercion de datos")
      return ''
    }
    return data

  }
  async obtenerPartidos(): Promise<any[]> {
    const { data, error } = await supabase
      .from('partido')
      .select('id,usuario(id , nombre, comunidad:comunidad_id(id,nombre)),fecha,hora_inicio,hora_final,resultado,nivel,genero,numero_jugadores') .order('fecha', { ascending: false })  // Ordenar primero por fecha, de más reciente a menos
      .order('hora_inicio', { ascending: false });

    if (error) {
      console.error('Error al obtener partidos:', error.message);
      return [];
    }
    return data;
  }

  async insertarEquipo(id_partido: string, id_user: string, equipo: number) {
    const { data, error } = await supabase
      .from('jugadoresPartido')
      .insert([
        { id_partido: id_partido, id_participante: id_user, equipo: equipo },
      ])
  }
  async obtenerJugadoresPartido(idPartido: string): Promise<any[]> {
    const { data, error } = await supabase.from('jugadoresPartido')
    .select('id,id_partido,usuario(id,nombre),equipo')
    .eq('id_partido', idPartido)
    .order('equipo', { ascending: true });
    if (error) {
      console.error('Error al obtener partidos:', error.message);
      return [];
    }
    return data;
  }
  async obtenerPartidosApuntado(idUser: any): Promise<any[]> {
    const { data, error } = await supabase
    .from('vista_jugadores_partido')
    .select('*')
    .eq('id_participante', idUser)
    .order('fecha', { ascending: false })
    .order('hora_inicio', { ascending: false });
    if (error) {
      console.error('Error al obtener partidos:', error.message);
      return [];
    }
    return data;
  }


  async actualizarResultado(id: string, resultado: string): Promise<void> {
    await supabase.from('partido').update({ resultado }).eq('id', id);
  }
  async eliminarPartido(partidoId: string) {
    return await supabase
      .from('partido')
      .delete()
      .eq('id', partidoId);
  }
}
