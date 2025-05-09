import { inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../Services/autenticacion.service';

export const sinRolGuard: CanActivateFn = (route, state,) => {
  const router = inject(Router);
  const rol = signal<any>(null)
  const auth = inject(AutenticacionService)
  auth.profile$.subscribe(perfil => {
    if (perfil.rol) {
      rol.set(perfil.rol);
    }
  })
  if (rol()) {
    return true
  } else {
    router.navigate(['navbar/sinRol'])
    return false
  }
};
