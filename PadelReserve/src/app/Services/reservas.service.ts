import { Injectable } from '@angular/core';
import { supabase } from '../app.config';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {


  constructor() { }

  async obtenerHorarios(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('horario')
        .select('id, hora')
        .order('hora', { ascending: true });

      if (error) {
        console.error('Error al obtener horarios:', error.message);
        return [];
      }

      return data;
    } catch (err) {
      console.error('Error inesperado al obtener horarios:', err);
      return [];
    }
  }
  async reservar(idUsuario:any,horarioId:any,idCalendario:any,fecha:any){
    try{
      const { data, error } = await supabase.from('reserva').insert({
      id_usuario: idUsuario,
      id_horario: horarioId,
      id_calendario: idCalendario,
      fecha: fecha
    });
    if(error){
      throw error
    }
    }catch(e){
      alert("Error al realizar la reserva")
    }
 
  }
  
  async cargarReservasPorVivienda(fecha: string, portal: string, piso: string, calendarioId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('reserva')
        .select('id, usuario(piso, portal)')
        .eq('fecha', fecha)
        .eq('id_calendario', calendarioId);

      if (error) {
        console.error('Error al cargar reservas por vivienda:', error.message);
        return 0;
      }

      const reservasDeLaVivienda = data.filter((r: any) =>
        r.usuario?.portal === portal && r.usuario?.piso === piso
      );

      return reservasDeLaVivienda.length;
    } catch (err) {
      console.error('Error inesperado al cargar reservas por vivienda:', err);
      return 0;
    }
  }

  async eliminarReserva(fecha: string, userId: string, calendarioId: string, horario: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('reserva')
        .delete()
        .eq('id_calendario', calendarioId)
        .eq('id_usuario', userId)
        .eq('id_horario', horario)
        .eq('fecha', fecha);

      if (error) {
        console.error('Error al cancelar la reserva:', error.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error inesperado al eliminar la reserva:', err);
      return false;
    }
  }

  async obtenerReservas(userId: string): Promise<{ nombre: string, calendario: string, horario: string, fecha: string, calendarioId: string }[]> {
    try {
      const { data, error } = await supabase
        .from('reserva')
        .select('usuario(nombre), calendario(id, nombre), horario(hora), fecha')
        .eq('id_usuario', userId)
        .order('fecha', { ascending: true })
        .order('horario(hora)', { ascending: true });

      if (error) {
        console.error('Error al obtener reservas activas:', error.message);
        return [];
      }

      return data.map((r: any) => ({
        nombre: r.usuario?.nombre,
        calendarioId: r.calendario?.id,
        calendario: r.calendario?.nombre,
        horario: r.horario?.hora,
        fecha: r.fecha
      }));
    } catch (err) {
      console.error('Error inesperado al obtener reservas activas:', err);
      return [];
    }
  }
}