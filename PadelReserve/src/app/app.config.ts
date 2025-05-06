import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { createClient } from '@supabase/supabase-js';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};

export const supabase = createClient(
  'https://eeperyasadaobjfxgtlf.supabase.co', // Sustituye con tu URL de Supabase
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlcGVyeWFzYWRhb2JqZnhndGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MDA0MDcsImV4cCI6MjA2MDk3NjQwN30.ti0IJfOD-uAAmQm1TMManSpaaI2pcPVkMfYOYFeBcW0' // Sustituye con tu clave anónima
 ,{
    auth: {
      persistSession: true,      // <== ¡esto es importante!
      autoRefreshToken: true,    // <== también importante para mantener la sesión viva
      storage: localStorage      // <== esto asegura que se guarda en localStorage
    }
  }

);
