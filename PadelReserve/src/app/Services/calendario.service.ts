import { inject, Injectable } from '@angular/core';
import { supabase } from '../app.config';
import { ReservasService } from './reservas.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  

   async obtenerCalendarios(id: any): Promise<
    { id: string, nombre: string, horaInicio: string, horaFin: string, horaInicioFinde: string, horaFinFinde: string }[]
  > {
    try {
      const { data, error } = await supabase
        .from('calendario')
        .select(`
          id,
          nombre,
          horaInicio:hora_inicio(id,hora),
          horaFin:hora_fin(id,hora),
          horaInicioFinde:hora_inicio_finde(id,hora),
          horaFinFinde:hora_fin_finde(id,hora)
        `)
        .eq('comunidad_id', id);

      if (error) throw error;
      return data as any;
    } catch (e) {
      console.error('Error al obtener calendarios:', (e as Error).message);
      return [];
    }
  }

  async obtenerCalendario(idCalendario: any): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('calendario')
        .select('id,nombre,hora_inicio,hora_fin,hora_inicio_finde,hora_fin_finde')
        .eq('id', idCalendario)
        .single();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Error al obtener calendario:', (e as Error).message);
      return null;
    }
  }

  async eliminarCalendario(idCalendario: any): Promise<boolean> {
    try {
      const { error } = await supabase.from('calendario').delete().eq('id', idCalendario);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Error al eliminar calendario:', (e as Error).message);
      return false;
    }
  }

  async crearCalendarios(idComunidad: any, datos: any): Promise<boolean> {
    try {
      const { error } = await supabase.from('calendario').insert([
        {
          comunidad_id: idComunidad,
          nombre: datos?.nombre,
          hora_inicio: datos?.horaInicio,
          hora_fin: datos?.horaFin,
          hora_inicio_finde: datos?.horaInicioFinde,
          hora_fin_finde: datos?.horaFinFinde,
        },
      ]);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Error al crear calendario:', (e as Error).message);
      return false;
    }
  }

  async obtenerHorasCalendario(horaInicio: any, horaFin: any): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('horario')
        .select('id,hora')
        .gte('id', horaInicio)
        .lte('id', horaFin);

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error('Error al obtener horas del calendario:', (e as Error).message);
      return [];
    }
  }

  async actualizarCalendario(calendario: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('calendario')
        .update({
          nombre: calendario.nombre,
          hora_inicio: calendario.hora_inicio,
          hora_fin: calendario.hora_fin,
          hora_inicio_finde: calendario.hora_inicio_finde,
          hora_fin_finde: calendario.hora_fin_finde,
        })
        .eq('id', calendario.id);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Error al actualizar calendario:', (e as Error).message);
      return false;
    }
  }
}
