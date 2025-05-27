import { inject, Injectable } from '@angular/core';
import { supabase } from '../app.config';
import { ReservasService } from './reservas.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  

  async obtenerCalendarios(id: number): Promise<{ id: string, nombre: string, horaInicio: string, horaFin: string,horaInicioFinde:string,horaFinFinde:string }[]> {

    const { data: data, error: error } = await supabase.from('calendario')
      .select(`
        id,
        nombre,
        horaInicio:hora_inicio(id,hora),
        horaFin:hora_fin(id,hora),
        horaInicioFinde:hora_inicio_finde(id,hora),
        horaFinFinde:hora_fin_finde(id,hora)

      `)
      .eq('comunidad_id', id)

    if (error) {
      throw error
      return []
    }
    console.log(data)
    return data as any
  }


  async obtenerCalendario(idCalendario: any) {
    const { data: data, error: error } = await supabase.from('calendario')
      .select('id,nombre,hora_inicio,hora_fin,hora_inicio_finde,hora_fin_finde')
      .eq('id', idCalendario).single()

    if (error) {
      throw error
      return []
    }
    console.log("El calendario es " , data)
    return data

  }
  async eliminarCalendario(idCalendario:any){
    const {data,error} = await supabase.from('calendario').delete().eq('id',idCalendario)
    if(error){
      throw error
    }
  }
  async crearCalendarios(idComunidad: any, datos: any) {
    console.log('esto es lo que llega al servicio calendario', datos)
    const { data, error } = await supabase.from('calendario').insert([{ comunidad_id: idComunidad,
       nombre: datos.nombre,
        hora_inicio: datos.horaInicio,
        hora_fin: datos.horaFin,
        hora_inicio_finde: datos.horaInicioFinde,
        hora_fin_finde: datos.horaFinFinde }])
    if (error) {
      console.log('no se ha podido crear el calendario',)
    }
  }
  async obtenerHorasCalendario(horaInicio: any, horaFin: any): Promise<any> {
    const { data, error } = await supabase.from('horario').select('id,hora').gte('id', horaInicio).lte('id', horaFin)
    if (error) {
      console.log('no se ha podido obtener las horas de este calendario',)
    } else {
      return data
    }
  }

  async actualizarCalendario(calendario:any){
    const {data,error} = await supabase.from('calendario')
    .update({nombre:calendario.nombre,
      hora_inicio:calendario.hora_inicio,
      hora_fin:calendario.hora_fin,
      hora_inicio_finde:calendario.hora_inicio_finde,
      hora_fin_finde:calendario.hora_fin_finde})
    .eq('id',calendario.id)
    if(error){
      throw error
    }
  }
}
