import { inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../Services/autenticacion.service';

export const sinComunidadGuard: CanActivateFn = (route, state) => {
 
  const router = inject(Router);
  const comunidad = signal<any>(null)
  const auth = inject(AutenticacionService)
  auth.profile$.subscribe(async perfil => {
    if (perfil.comunidad?.id) {
      await comunidad.set(perfil.comunidad.id);
    }
  })
  if (comunidad()) {
    return true
  } else {
    router.navigate(['navbar/sinRol'])
    return false
  }
};
