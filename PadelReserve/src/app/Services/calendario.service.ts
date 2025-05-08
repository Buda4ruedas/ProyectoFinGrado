import { Injectable } from '@angular/core';
import { supabase } from '../app.config';
import { ReservasService } from './reservas.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  constructor(private reservaService:ReservasService) { }

async obtenerCalendarios(id:number):Promise<{ id: string, nombre: string }[]>{

const {data:data,error:error} = await supabase.from('calendario')
.select('id,nombre')
.eq('comunidad_id',id)

if(error){
  throw error
  return []
}
console.log(data)
return data
}
async obtenerCalendario(idCalendario:any){
  const {data:data,error:error} = await supabase.from('calendario')
.select('id,nombre,hora_inicio,hora_fin')
.eq('id',idCalendario).single()

if(error){
  throw error
  return []
}
console.log(data)
return data

}



async crearCalendarios(idComunidad:any,datos:any){
  const hora_inicio = await this.reservaService.obtenerIdHorario(datos.horaInicio)
  const hora_final = await this.reservaService.obtenerIdHorario(datos.horaFin)
  console.log('hora inicio : ', hora_inicio)
  console.log('hora fin : ', hora_final)

  console.log('esto es lo que llega al servicio calendario', datos)
  const {data,error} = await supabase.from('calendario').insert([{comunidad_id:idComunidad,nombre:datos.nombre,hora_inicio:hora_inicio.id,hora_fin:hora_final.id}])
  if(error){
    console.log('no se ha podido crear el calendario',)
  }
}
async obtenerHorasCalendario(horaInicio:any,horaFin:any):Promise<any>{
  const {data,error} = await supabase.from('horario').select('id,hora').gte('id',horaInicio).lte('id',horaFin)
  if(error){
    console.log('no se ha podido crear el calendario',)
  }else{
    return data
  }
}









}
