import { Injectable } from '@angular/core';
import { supabase } from '../app.config';
import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private profileSubject = new BehaviorSubject<any | null>(null);

  user$ = this.userSubject.asObservable();
  profile$ = this.profileSubject.asObservable();

  constructor(private router: Router) {
    // Recuperamos la sesión al iniciar el servicio
    // this.recoverSession();
  }

  setPerfil(perfil: any) {
    this.profileSubject.next({...perfil});
  }

  // Recuperar sesión desde Supabase
  async recoverSession(): Promise<void> {
    const { data, error } = await supabase.auth.getSession();
  
    if (data?.session) {
      console.log('Sesión recuperada:', data.session); // Asegúrate de que se está recuperando la sesión
      this.userSubject.next(data.session.user);
      await this.loadProfile(data.session.user.id);
    } else {
      // Si no hay sesión, limpiamos los datos
      console.log('No hay sesión almacenada');
      this.userSubject.next(null);
      this.profileSubject.next(null);
    }
  }

  // Cargar perfil desde la base de datos
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
    nombre)
      
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

  // Login
  async login(email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('[Auth] Error al iniciar sesión:', error.message);
      return false;
    }

    this.userSubject.next(data.user);
    await this.loadProfile(data.user.id);
    return true;
  }

  // Logout
  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.userSubject.next(null);
    this.profileSubject.next(null);
    this.router.navigate(['']);
  }
}
