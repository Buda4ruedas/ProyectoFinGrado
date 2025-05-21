import { inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../Services/autenticacion.service';
import { map, take } from 'rxjs';

export const sinComunidadGuard: CanActivateFn = (route, state) => {
 
const router = inject(Router);
const auth = inject(AutenticacionService)
const perfil = auth.perfilSignal;
if(!perfil().nombre){
 router.navigate(['completarPerfil'])
 return false
}else if(!perfil().comunidad?.id){
    router.navigate(['sinRol']);
    return false
}
  return true
}
