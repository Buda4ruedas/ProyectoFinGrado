import { Injectable } from '@angular/core';
import { supabase } from '../app.config';
import { UsuarioService } from './usuario.service';
import { CalendarioService } from './calendario.service';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {

  constructor(private usuarioService:UsuarioService,private calendarioService:CalendarioService){

  }
async crearComunidad(datos:any,userId:any,portal:any,piso:any){
const {data,error} = await supabase.from('comunidad')
.insert([{nombre:datos.nombre,
  cp:datos.cp,
  poblacion:datos.poblacion,
  seguridad:datos.seguridad,
  direccion:datos.direccion,
  provincia:datos.provincia,
  codigo_acceso:datos.codigoAcceso,
  administrador:userId}]).select('id')
  console.log('datos', data)
  

if(error){
console.log('no se ha podido añadir la comunidad')
return;
}
await this.usuarioService.ponerRolAdministrador(data[0].id,userId,portal,piso)
console.log('los datos son ', datos)
console.log('los calendarios son ' , datos.calendarios)
for(let i=0;i<datos.calendarios.length;i++){
  await this.calendarioService.crearCalendarios(data[0].id,datos.calendarios[i])
}
}

}