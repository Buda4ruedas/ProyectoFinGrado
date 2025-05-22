import { Injectable } from '@angular/core';
import { supabase } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  async subirImagen(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('fotos')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw new Error(`Error al subir la imagen: ${error.message}`);
    }

    // Verificar si 'data' contiene 'path'
    if (!data?.path) {
      throw new Error('No se encontró la ruta del archivo subido');
    }

    return this.obtenerUrlPublica(data.path);
  }

  async obtenerUrlPublica(path: string): Promise<string> {
    // Obtener la URL pública del archivo
    const { data } = await supabase.storage.from('fotos').getPublicUrl(path);

    // Verificar si 'data' contiene la URL pública
    if (!data?.publicUrl) {
      throw new Error('No se pudo obtener la URL pública');
    }

    return data.publicUrl;
  }
}

