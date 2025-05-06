import { Injectable } from '@angular/core';
import { supabase } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  constructor() { }

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









}
