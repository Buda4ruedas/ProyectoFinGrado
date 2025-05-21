import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../Services/autenticacion.service';
import { inject } from '@angular/core';
import { first, map } from 'rxjs';

export const accesoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);

  const perfil = authService.perfil;
  if (!perfil) {
    router.navigate(['']);
    return false;
  }else if(!perfil.nombre){
    router.navigate(['navbar/completarPerfil'])
    return true
  }

  return true;
};
