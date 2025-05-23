import { Injectable } from '@angular/core';
import { supabase } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  async subirImagen(file: File, path: string,tabla:string): Promise<string> {
  console.log("El path es", path);
  console.log(tabla)

  // Extraer la carpeta (el id) del path
  const partes = path.split('/');
  const carpeta = partes[0];  // El id del usuario

  // Listar los archivos dentro de la carpeta del usuario
  const { data: imagenes, error: erroreseleccion } = await supabase.storage.from(tabla).list(carpeta);

  if (erroreseleccion) {
    throw new Error(`Error al listar las imágenes: ${erroreseleccion.message}`);
  }

  // Verificar si hay una foto existente (en este caso "fotoPerfil.jpg")
  const imagenExistente = imagenes[0]?.name

  if (imagenExistente) {
    
    const { data: eliminados, error: erroreliminacion } = await supabase.storage.from(tabla).remove([`${carpeta}/${imagenExistente}`]);

    if (erroreliminacion) {
      throw new Error(`Error al eliminar la imagen existente: ${erroreliminacion.message}`);
    }

    console.log(`Imagen ${imagenExistente} eliminada correctamente.`);
  }
  const { data, error } = await supabase.storage
    .from(tabla)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }

  if (!data?.path) {
    throw new Error('No se encontró la ruta del archivo subido');
  }

  // Obtener la URL pública
  return this.obtenerUrlPublica(data.path,tabla);
}

  async obtenerUrlPublica(path: string, tabla:string): Promise<string> {
    
    const { data } = await supabase.storage.from(tabla).getPublicUrl(path);

    if (!data?.publicUrl) {
      throw new Error('No se pudo obtener la URL pública');
    }

    return data.publicUrl;
  }
}

