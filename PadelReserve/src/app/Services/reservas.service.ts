import { Injectable } from '@angular/core';
import { supabase } from '../app.config';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {


  constructor() { }

  async obtenerHorarios(): Promise<string[]> {
    const { data, error } = await supabase
      .from('horario')
      .select('hora')
      .order('hora', { ascending: true });

    if (error) {
      console.error('Error al obtener horarios:', error.message);
      return [];
    }
    return data.map((registro: any) => registro.hora);
  }


  async cargarReservasporUsuario(fecha:string,userId:string,calendarioId:string):Promise<number>{
    const {data,error} = await supabase.from('reserva')
    .select('*')
    .eq('id_calendario',calendarioId)
    .eq('id_usuario',userId)
    .eq('fecha',fecha)
    if(error){
      console.log("Error al obtener las resrvas del usuario ",userId)
      return 0;
    }
    let contador = 0;
    data.forEach(respuesta=>{
      contador++;
    })
    console.log("La cantidad de reservas durante el dia que se quiere reservar es de " , contador)
    return contador;
  }

  async eliminarReserva(fecha:string,userId:string,calendarioId:string,horario:string){
    const {data,error} = await supabase.from('reserva').delete()
    .eq('id_calendario', calendarioId)
    .eq('id_usuario',userId)
    .eq('id_horario',horario)
    .eq('fecha',fecha)
    if(error){
      console.log("Error al cancelar esta reserva")
    }

  }
  async obtenerReservas(userId:string):Promise<{nombre:string,calendario:string,horario:string,fecha:string,calendarioId:string}[]>{
    const {data,error} = await supabase.from('reserva')
    .select('usuario(nombre),calendario(id,nombre),horario(hora),fecha') 
    .order('fecha', { ascending: true })
    .order('horario(hora)', { ascending: true })
    .eq('id_usuario',userId)
    if (error) {
      console.error('Error al obtener reservas activas:', error);
      return [];
    }
    return data.map((r: any) => ({
      nombre: r.usuario.nombre,
      calendarioId:r.calendario.id,
      calendario: r.calendario.nombre,
      horario: r.horario.hora,
      fecha: r.fecha
    }));
  }






















}
