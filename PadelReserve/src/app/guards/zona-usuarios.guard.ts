import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../Services/autenticacion.service';
import { inject } from '@angular/core';

export const zonaUsuariosGuard: CanActivateFn = (route, state) => {
const autenticationService = inject(AutenticacionService)
const perfil = autenticationService.perfilSignal()
const router = inject(Router)

if(!perfil.comunidad?.id ||!perfil.rol){
router.navigate(["navbar/sinRol"])
return false
}
 return true;
};
