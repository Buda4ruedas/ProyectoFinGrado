import { Injectable } from '@angular/core';
import { supabase } from '../app.config';
import { User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  
  private profileSubject = new BehaviorSubject<any | null>(null);
  profile$ = this.profileSubject.asObservable();
 
  setPerfil(perfil: any) {
    this.profileSubject.next({ ...perfil });
  }
  async recoverSession(): Promise<void> {
    const { data, error } = await supabase.auth.getSession();

    if (data?.session) {
      await this.loadProfile(data.session.user.id);
    } else {
      console.log('No hay sesión almacenada');
      this.profileSubject.next(null);
    }
  }

  async loadProfile(userId: string): Promise<void> {
    const { data, error } = await supabase
      .from('usuario')
      .select(`id,
        nombre,
        apellidos,
        portal,
        piso,
        fotografia,
        email,
        comunidad:comunidad_id(id,
        nombre),
        rol  
      `)
      .eq('id', userId)
      .single();

    if (!error && data) {
      this.profileSubject.next(data);
    } else {
      console.error('Error al cargar el perfil:', error?.message);
      this.profileSubject.next(null);
    }
  }


  async login(email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('[Auth] Error al iniciar sesión:', error.message);
      return false;
    }

 
    await this.loadProfile(data.user.id);
    return true;
  }
  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.profileSubject.next(null);
  }
  async registro(email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      console.error('[Auth] Error al registrar:', error.message);
      return false;
    }

    return true;
  }

  async cambiarPassword(nuevaPassword: string): Promise<boolean> {
  const { data, error } = await supabase.auth.updateUser({
    password: nuevaPassword
  });

  if (error) {
    console.error('Error al cambiar contraseña:', error.message);
    return false;
  }

  return true;
}
}
