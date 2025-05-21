import { inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../Services/autenticacion.service';


export const sinRolGuard: CanActivateFn = (route, state,) => {
  const router = inject(Router);
  const auth = inject(AutenticacionService)
  const perfil = auth.perfilSignal;
  console.log("SE ejecut la guardia" , perfil())
  if (!perfil().nombre) {
    router.navigate(['/navbar/completarPerfil']); 
    return false;
  } else if (!perfil().rol) {
    router.navigate(['/navbar/sinRol']); 
    return false;
  }
  return true;
};
