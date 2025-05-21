import { Routes } from '@angular/router';
import { PrincipalComponent } from './Core/principal/principal.component';
import { ReservasActivasComponent } from './Core/reservas-activas/reservas-activas.component';
import { HistoricoReservasComponent } from './Core/historico-reservas/historico-reservas.component';
import { BuscarPartidosComponent } from './Core/buscar-partidos/buscar-partidos.component';
import { CalendarioComponent } from './Shared/calendario/calendario.component';
import { CrearPartidoComponent } from './Core/crear-partido/crear-partido.component';
import { LoginComponent } from './Core/login/login.component';
import { NavBarComponent } from './Shared/nav-bar/nav-bar.component';

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
import { MiComunidadComponent } from './Core/mi-comunidad/mi-comunidad.component';
import { sinComunidadGuard } from './guards/sin-comunidad.guard';
import { AjustesComunidadComponent } from './Core/ajustes-comunidad/ajustes-comunidad.component';
import { GestionUsuariosComponent } from './Core/gestion-usuarios/gestion-usuarios.component';
import { GestionCalendariosComponent } from './Core/gestion-calendarios/gestion-calendarios.component';
import { GestionComunidadComponent } from './Core/gestion-comunidad/gestion-comunidad.component';
import { RegistrarseComponent } from './Core/registrarse/registrarse.component';
import { CambiarContraseniaComponent } from './Core/cambiar-contrasenia/cambiar-contrasenia.component';
import { InicioComponent } from './Core/inicio/inicio.component';



export const routes: Routes = [
  { path: '', component: InicioComponent},
  { path: 'registrarse', component: RegistrarseComponent },
  { path: 'login', component: LoginComponent},
  {
    path: 'navbar',
    component: NavBarComponent,
    canActivate: [accesoGuard],
    children: [
      { path: 'principal', component: PrincipalComponent, canActivate: [sinRolGuard] },
      { path: 'reservasActivas', component: ReservasActivasComponent, canActivate: [sinRolGuard] },
      { path: 'historicoReservas', component: HistoricoReservasComponent, canActivate: [sinRolGuard] },
      { path: 'buscarPartidos', component: BuscarPartidosComponent, canActivate: [sinRolGuard] },
      { path: 'calendario/:id', component: CalendarioComponent, canActivate: [sinRolGuard] },
      { path: 'crearPartido', component: CrearPartidoComponent, canActivate: [sinRolGuard] },
      { path: 'perfil', component: PerfilComponent },
      { path: 'cambiarContrasenia', component: CambiarContraseniaComponent },
      { path: 'partido/:id', component: PartidoComponent, canActivate: [sinRolGuard] },
      { path: 'misPartidos', component: MisPartidosComponent, canActivate: [sinRolGuard] },
      { path: 'buscarComunidad', component: BuscarComunidadComponent },
      { path: 'usuariosPendientes', component: UsuariosPendientesComponent, canActivate: [sinRolGuard] },
      { path: 'ajustesComunidad', component: AjustesComunidadComponent, canActivate: [sinRolGuard] },
      { path: 'gestionUsuarios', component: GestionUsuariosComponent, canActivate: [sinRolGuard] },
      { path: 'gestionCalendarios', component: GestionCalendariosComponent, canActivate: [sinRolGuard] },
      { path: 'gestionComunidad', component: GestionComunidadComponent, canActivate: [sinRolGuard] },
      { path: 'crearComunidad', component: CrearComunidadComponent },
      { path: 'miComunidad', component: MiComunidadComponent, canActivate: [sinComunidadGuard] },
      { path: 'sinRol', component: SinRolComponent },
      { path: 'completarPerfil', component: CompletarPerfilComponent }
    ]
  }
];
