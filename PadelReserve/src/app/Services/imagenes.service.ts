import { Injectable } from '@angular/core';
import { supabase } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  async subirImagen(file: File, path: string, tabla: string): Promise<string | null> {
    try {
      console.log("El path es", path);
      console.log(tabla);

      const partes = path.split('/');
      const carpeta = partes[0];  

      const { data: imagenes, error: erroreseleccion } = await supabase.storage.from(tabla).list(carpeta);

      if (erroreseleccion) {
        console.error('Error al listar las imágenes:', erroreseleccion.message);
        return null;
      }

      
      const imagenExistente = imagenes[0]?.name;
      if (imagenExistente) {
        const { error: erroreliminacion } = await supabase.storage.from(tabla).remove([`${carpeta}/${imagenExistente}`]);
        if (erroreliminacion) {
          console.error('Error al eliminar la imagen existente:', erroreliminacion.message);
          return null;
        }
        console.log(`Imagen ${imagenExistente} eliminada correctamente.`);
      }

      const { data, error } = await supabase.storage
        .from(tabla)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error || !data?.path) {
        console.error('Error al subir la imagen:', error?.message || 'Ruta no encontrada');
        return null;
      }

      return await this.obtenerUrlPublica(data.path, tabla);
    } catch (err) {
      console.error('Error inesperado al subir imagen:', err);
      return null;
    }
  }

  async obtenerUrlPublica(path: string, tabla: string): Promise<any> {
    try {
      const { data } = await supabase.storage.from(tabla).getPublicUrl(path);

      if (!data?.publicUrl) {
        console.error('No se pudo obtener la URL pública');
        return null;
      }

      return data.publicUrl;
    } catch (err) {
      console.error('Error al obtener URL pública:', err);
      return null;
    }
  }
}
