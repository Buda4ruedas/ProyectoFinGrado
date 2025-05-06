import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../Services/autenticacion.service';
import { inject } from '@angular/core';
import { first, map } from 'rxjs';

export const accesoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacionService); 
  const router = inject(Router); 

  return authService.user$.pipe(
    first(), // Toma solo el primer valor emitido
    map(user => {
      if (!user) {
        router.navigate(['login']); // Redirige a la página de login si no hay usuario
        return false; // Impide el acceso
      }
      return true; // Permite el acceso
    })
  );
};
