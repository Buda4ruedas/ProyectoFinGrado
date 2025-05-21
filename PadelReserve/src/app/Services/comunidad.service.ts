import { Injectable } from '@angular/core';
import { supabase } from '../app.config';
import { UsuarioService } from './usuario.service';
import { CalendarioService } from './calendario.service';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {

  constructor(private usuarioService: UsuarioService, private calendarioService: CalendarioService) {

  }
  async crearComunidad(datos: any, userId: any, portal: any, piso: any) {
    const { data, error } = await supabase.from('comunidad')
      .insert([{
        nombre: datos.nombre,
        cp: datos.cp,
        poblacion: datos.poblacion,
        seguridad: datos.seguridad,
        direccion: datos.direccion,
        provincia: datos.provincia,
        codigo_acceso: datos.codigoAcceso
      }]).select('id')
    console.log('datos', data)


    if (error) {
      console.log('no se ha podido añadir la comunidad')
      return;
    }
    await this.usuarioService.ponerRolAdministrador(data[0].id, userId, portal, piso)
    console.log('los datos son ', datos)
    console.log('los calendarios son ', datos.calendarios)
    for (let i = 0; i < datos.calendarios.length; i++) {
      await this.calendarioService.crearCalendarios(data[0].id, datos.calendarios[i])
    }
  }

  async obtenerComunidad(idComunidad: any): Promise<any> {
    const { data, error } = await supabase.from('comunidad').select('*').eq('id', idComunidad).single()
    if (error) {
      console.log('No se ha podido obtener los datos de la comunidad', error)
      return;
    } else {
      console.log(data, 'datos de obtener comunidad')
      return data
    }

  }

  async obtenerNumeroVecinos(idComunidad: any): Promise<any> {
    const { data, error } = await supabase.from('usuario').select('*').eq('comunidad_id', idComunidad)
    if (error) {
      return
    } else {
      let contador = 0
      data.forEach(resp => {
        contador++
      })
      return contador
    }
  }
  async obtenerAdministradores(idComunidad?: any):Promise<any[]> {
    const { data, error } = await supabase.from('usuario').select('nombre,email').eq('comunidad_id', idComunidad).eq('rol','administrador')
    if (error) {
      console.log("no se ha podido obtener los administradores de la comunidad", error)
      return[]
    }else{
        return data.map((admin) => ({
      nombre: admin.nombre,
      email: admin.email
    }));
    }
  }
  async obtenerCalendarios(idComunidad:any):Promise<string[]>{
    const {data,error}  =await supabase.from('calendario').select('nombre').eq('comunidad_id',idComunidad)
    if(error){
      console.log('no se ha podido obtener los calendaros', error)
      return[]
    }else{
     return data.map((calendarios)=>calendarios.nombre)
    }
  }
  async eliminarComunidad(idComunidad:any){
    const {data,error}  = await supabase.from('comunidad').delete().eq('id',idComunidad)
    if(error){
      throw error
    }
  }
  async actualizarComunidad(idComunidad:any,datos:any){
    const {data,error}  = await supabase.from('comunidad')
    .update({nombre:datos.nombre,
      direccion:datos.direccion,
      cp:datos.cp,
      poblacion:datos.poblacion,
      seguridad:datos.seguridad,
      codigo_acceso:datos.codigoAcceso}).eq('id',idComunidad)
      if(error){
        throw error
      }
  }
  async obtenerComunidades():Promise<any>{
    const {data,error} = await supabase.from('comunidad').select('*')
    if(error){
      console.log('no se han podido obtener las comunidades')
      return null;
    }else{
      return data
    }

  }





}