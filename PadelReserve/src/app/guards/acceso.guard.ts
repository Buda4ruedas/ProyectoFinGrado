import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../Services/autenticacion.service';
import { inject } from '@angular/core';
import { first, map } from 'rxjs';

export const accesoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacionService); 
  const router = inject(Router); 

  return authService.profile$.pipe(
    first(), 
    map(user => {
      if (!user) {
        router.navigate(['login']); 
        return false; 
      }
      return true; 
    })
  );
};
