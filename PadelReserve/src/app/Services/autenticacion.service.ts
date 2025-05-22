import { inject, Injectable, signal } from '@angular/core';
import { supabase } from '../app.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  route = inject(Router)
  private _perfil = signal<any | null>(null);
  get perfil() {
    return this._perfil();
  }
  perfilSignal = this._perfil;

  setPerfil(perfil: any) {
    this._perfil.set({ ...perfil });
  }

  async recoverSession(): Promise<void> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error al obtener sesión:', error.message);
      this._perfil.set(null);
      return;
    }

    if (data?.session) {
      console.log("la sesion es " , data.session)
      await this.loadProfile(data.session.user.id);
      

    } else {
      console.log('No hay sesión almacenada');
      this._perfil.set(null);
    }
  } catch (e) {
    console.error('Error al recuperar la sesión:', (e as Error).message);
    this._perfil.set(null);
  }
}

async loadProfile(userId: string): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select(`id, nombre, apellidos, portal, piso, fotografia, email, comunidad:comunidad_id(id, nombre), rol`)
      .eq('id', userId)
      .single();

    if (!error && data) {
      this._perfil.set(data);
    } else {
      console.error('Error al cargar el perfil:', error?.message);
      this._perfil.set(null);
    }
  } catch (e) {
    console.error('Error inesperado al cargar perfil:', (e as Error).message);
    this._perfil.set(null);
  }
}

  async login(email: string, password: string): Promise<{ success: boolean; mensaje: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Error general (credenciales, bloqueo, etc.)
      return { success: false, mensaje: error.message };
    }

    // Si no hay sesión aquí, es porque no confirmó el email
    if (!data.session) {
      // Limpia cualquier rastro que pueda haber quedado
      await supabase.auth.signOut();
      return {
        success: false,
        mensaje: 'Tu cuenta aún no está confirmada. Revisa tu correo y haz clic en el enlace de verificación.',
      };
    }

    // Si llegamos aquí, hay sesión y user válidos
    await this.loadProfile(data.session.user.id);
    return { success: true, mensaje: 'Login exitoso.' };
  } catch (e) {
    console.error('Error inesperado en login:', e);
    // Si por algún motivo queda un estado atascado, lo limpiamos
    await supabase.auth.signOut();
    return { success: false, mensaje: 'Ha ocurrido un error. Por favor inténtalo de nuevo más tarde.' };
  }
}

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this._perfil.set(null);
    } catch (e) {
      console.error('Error al cerrar sesión:', (e as Error).message);
    }
  }

async registro(email: string, password: string): Promise<{ success: boolean; mensaje: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log('signUp data:', data);
    console.log('signUp error:', error);

    if (error) {
      return { success: false, mensaje: `Error: ${error.message}` };
    }
    return { success: true, mensaje: 'Registro exitoso. Revisa tu correo para confirmar tu cuenta.' };
  } catch (e) {
    console.error('Excepción en registro:', e);
    return { success: false, mensaje: 'Error inesperado. Inténtalo de nuevo más tarde.' };
  }
}



  async cambiarPassword(nuevaPassword: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: nuevaPassword,
      });
      if (error) {
        console.error('Error al cambiar contraseña:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Error inesperado al cambiar contraseña:', (e as Error).message);
      return false;
    }
  }

  async recuperarContrasenia(email: string): Promise<{ success: boolean; mensaje: string }> {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://tu-app.com/reset-password'  // Cambia a tu dominio real y ruta
    });

    if (error) {
      return { success: false, mensaje: error.message };
    }

    return { success: true, mensaje: 'Email de recuperación enviado. Revisa tu correo.' };
  } catch (e) {
    return { success: false, mensaje: 'Error inesperado. Intenta de nuevo.' };
  }
}
}

