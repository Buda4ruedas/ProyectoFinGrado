import { Routes } from '@angular/router';
import { PrincipalComponent } from './Core/principal/principal.component';
import { ReservasActivasComponent } from './Core/reservas-activas/reservas-activas.component';
import { HistoricoReservasComponent } from './Core/historico-reservas/historico-reservas.component';
import { BuscarPartidosComponent } from './Core/buscar-partidos/buscar-partidos.component';
import { CalendarioComponent } from './Shared/calendario/calendario.component';
import { CrearPartidoComponent } from './Core/crear-partido/crear-partido.component';
import { LoginComponent } from './Core/login/login.component';
import { NavBarComponent } from './Shared/nav-bar/nav-bar.component';
import { SolicitudAccesoComponent } from './Core/solicitud-acceso/solicitud-acceso.component';
import { CompletarPerfilComponent } from './Core/completar-perfil/completar-perfil.component';
import { accesoGuard } from './guards/acceso.guard';
import { PerfilComponent } from './Core/perfil/perfil.component';
import { PartidoComponent } from './Shared/partido/partido.component';
import { MisPartidosComponent } from './Core/mis-partidos/mis-partidos.component';
import { BuscarComunidadComponent } from './Core/buscar-comunidad/buscar-comunidad.component';
import { UsuariosPendientesComponent } from './Core/usuarios-pendientes/usuarios-pendientes.component';
import { CrearComunidadComponent } from './Core/crear-comunidad/crear-comunidad.component';
import { sinRolGuard } from './guards/sin-rol.guard';
import { SinRolComponent } from './Shared/sin-rol/sin-rol.component';

export const routes: Routes = [
    {path:'', component:LoginComponent},
    {path:'navbar', component:NavBarComponent,canActivate: [accesoGuard],
         children:[
        {path:'principal',component: PrincipalComponent,canActivate:[sinRolGuard]},
        {path:'reservasActivas', component: ReservasActivasComponent,canActivate:[sinRolGuard]},
        {path:'historicoReservas', component: HistoricoReservasComponent,canActivate:[sinRolGuard]},
        {path:'buscarPartidos', component: BuscarPartidosComponent,canActivate:[sinRolGuard]},
        {path:'calendario/:id', component: CalendarioComponent,canActivate:[sinRolGuard]},
        {path:'crearPartido', component: CrearPartidoComponent,canActivate:[sinRolGuard]},
        {path:'completarPerfil',component:CompletarPerfilComponent},
        {path:'perfil',component:PerfilComponent},
        {path:'partido/:id',component:PartidoComponent,canActivate:[sinRolGuard]},
        {path:'misPartidos',component:MisPartidosComponent,canActivate:[sinRolGuard]},
        {path:'buscarComunidad',component:BuscarComunidadComponent},
        {path:'usuariosPendientes',component:UsuariosPendientesComponent,canActivate:[sinRolGuard]},
        {path:'crearComunidad',component:CrearComunidadComponent},
        {path:'sinRol',component:SinRolComponent}


    ]},
    {path:'solicitud',component:SolicitudAccesoComponent},
    {path:'**', redirectTo:''}
 


   
];
