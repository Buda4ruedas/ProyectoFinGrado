import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../Services/autenticacion.service';
import { inject } from '@angular/core';

export const accesoGuard: CanActivateFn = (route, state) => {
const autenticationService = inject(AutenticacionService)
const router = inject(Router)
const perfil = autenticationService.perfilSignal()
if(!perfil){
  return false
}
  return true;
};
