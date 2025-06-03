import { Routes } from '@angular/router';
import { PrincipalComponent } from './Core/principal/principal.component';
import { ReservasActivasComponent } from './Core/reservas-activas/reservas-activas.component';
import { HistoricoReservasComponent } from './Core/historico-reservas/historico-reservas.component';
import { BuscarPartidosComponent } from './Core/buscar-partidos/buscar-partidos.component';
import { CalendarioComponent } from './Shared/calendario/calendario.component';
import { CrearPartidoComponent } from './Core/crear-partido/crear-partido.component';
import { NavBarComponent } from './Shared/nav-bar/nav-bar.component';
import { CompletarPerfilComponent } from './Core/completar-perfil/completar-perfil.component';
import { PerfilComponent } from './Core/perfil/perfil.component';
import { PartidoComponent } from './Shared/partido/partido.component';
import { MisPartidosComponent } from './Core/mis-partidos/mis-partidos.component';
import { BuscarComunidadComponent } from './Core/buscar-comunidad/buscar-comunidad.component';
import { UsuariosPendientesComponent } from './Core/usuarios-pendientes/usuarios-pendientes.component';
import { CrearComunidadComponent } from './Core/crear-comunidad/crear-comunidad.component';
import { SinRolComponent } from './Shared/sin-rol/sin-rol.component';
import { MiComunidadComponent } from './Core/mi-comunidad/mi-comunidad.component';
import { AjustesComunidadComponent } from './Core/ajustes-comunidad/ajustes-comunidad.component';
import { GestionUsuariosComponent } from './Core/gestion-usuarios/gestion-usuarios.component';
import { GestionCalendariosComponent } from './Core/gestion-calendarios/gestion-calendarios.component';
import { GestionComunidadComponent } from './Core/gestion-comunidad/gestion-comunidad.component';
import { RegistrarseComponent } from './Core/registrarse/registrarse.component';
import { CambiarContraseniaComponent } from './Core/cambiar-contrasenia/cambiar-contrasenia.component';
import { InicioComponent } from './Core/inicio/inicio.component';
import { accesoGuard } from './guards/acceso.guard';
import { zonaUsuariosGuard } from './guards/zona-usuarios.guard';




export const routes: Routes = [
  { path: '', component: InicioComponent},
  {
    path: 'navbar',
    component: NavBarComponent, canActivate: [accesoGuard],
    children: [
      { path: 'principal', component: PrincipalComponent, canActivate:[zonaUsuariosGuard] },
      { path: 'reservasActivas', component: ReservasActivasComponent, canActivate:[zonaUsuariosGuard] },
      { path: 'historicoReservas', component: HistoricoReservasComponent, canActivate:[zonaUsuariosGuard]},
      { path: 'buscarPartidos', component: BuscarPartidosComponent, canActivate:[zonaUsuariosGuard]  },
      { path: 'calendario/:id', component: CalendarioComponent, canActivate:[zonaUsuariosGuard]  },
      { path: 'crearPartido', component: CrearPartidoComponent, canActivate:[zonaUsuariosGuard]  },
      { path: 'perfil', component: PerfilComponent },
      { path: 'cambiarContrasenia', component: CambiarContraseniaComponent },
      { path: 'partido/:id', component: PartidoComponent, canActivate:[zonaUsuariosGuard]  },
      { path: 'misPartidos', component: MisPartidosComponent, canActivate:[zonaUsuariosGuard]  },
      { path: 'buscarComunidad', component: BuscarComunidadComponent },
      { path: 'usuariosPendientes', component: UsuariosPendientesComponent,  },
      { path: 'ajustesComunidad', component: AjustesComunidadComponent,  },
      { path: 'gestionUsuarios', component: GestionUsuariosComponent,  },
      { path: 'gestionCalendarios', component: GestionCalendariosComponent,  },
      { path: 'gestionComunidad', component: GestionComunidadComponent,  },
      { path: 'crearComunidad', component: CrearComunidadComponent },
      { path: 'miComunidad', component: MiComunidadComponent },
      { path: 'sinRol', component: SinRolComponent },
      { path: 'completarPerfil', component: CompletarPerfilComponent }
    ]
  },
  {path:'**', redirectTo:''}
];
