import { Component, signal } from '@angular/core';
import { supabase } from '../../app.config';
import { CommonModule } from '@angular/common';
import { ComunidadComponent } from "../../Shared/comunidad/comunidad.component";
import { FormsModule } from '@angular/forms';
import { PopUpCodigoComunidadComponent } from '../../Shared/pop-up-codigo-comunidad/pop-up-codigo-comunidad.component';
import { UsuarioService } from '../../Services/usuario.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { PopUpConfirmacionComponent } from '../../Shared/pop-up-confirmacion/pop-up-confirmacion.component';
import { ComunidadService } from '../../Services/comunidad.service';


@Component({
  selector: 'app-buscar-comunidad',
  imports: [CommonModule, ComunidadComponent, FormsModule, PopUpCodigoComunidadComponent, PopUpConfirmacionComponent],
  templateUrl: './buscar-comunidad.component.html',
  styleUrl: './buscar-comunidad.component.css'
})
export class BuscarComunidadComponent {
  filtro = '';
  comunidades = signal<any[]>([]);
  comunidadesFiltradas = signal<any[]>([]);
  codigo: string = '';
  comunidadSeleccionada: any;
  mostrarPopUp = signal<boolean>(false);
  mostrarPortalPopUp = signal<boolean>(false);
  perfil = signal<any>(null);
  loading = signal<boolean>(true);
  mostrarConfirmacionPopUp = signal<boolean>(false)
  cambio = false
  portal: any
  piso: any

  constructor(private usuarioService: UsuarioService, private autenticacionService: AutenticacionService,private comunidadService:ComunidadService) {
    this.autenticacionService.profile$.subscribe(perfil => {
      if (perfil) {
        this.perfil.set(perfil)
      }
    });
  }
  async ngOnInit() {
    const { data, error } = await supabase.from('comunidad').select('*');
    if (!error && data) {
      this.comunidades.set(data);
      this.comunidadesFiltradas.set(data);
    }
    setTimeout(() => {
      this.loading.set(false);
    }, 500)

  }

  filtrar() {
    this.loading.set(true);
    setTimeout(() => {
      const f = this.filtro.toLowerCase();
      console.log('el filtro es ', this.filtro);

      const resultados = this.comunidades().filter(c =>
        c.nombre.toLowerCase().includes(f) ||
        c.direccion.toLowerCase().includes(f) ||
        c.poblacion.toLowerCase().includes(f) ||
        c.provincia.toLowerCase().includes(f)
      );

      this.comunidadesFiltradas.set(resultados);
      this.loading.set(false);
    }, 500);
  }

  async onUnirse(comunidad: any) {
    this.comunidadSeleccionada = comunidad;
    const puede = await this.puedeAbandonar(comunidad.id);
    if(puede){
    if (this.comunidadSeleccionada.seguridad == 'privada') {
      this.mostrarPopUp.set(true);
    } else {
      this.mostrarPortalPopUp.set(true)
    }
    }else{
      alert('No puedes abandonar la comunidad siendo el único administrador.');
    }


  }
  async onAbandonar(comunidad:any) {
  const puede = await this.puedeAbandonar(comunidad.id);
    console.log(puede)
    if (puede) {
      this.mostrarConfirmacionPopUp.set(true)
    } else {
      alert('No puedes abandonar la comunidad siendo el único administrador.');
    }
    
  }

  onConfirmarCodigo(codigo: string) {
    if (this.comunidadSeleccionada.codigo_acceso == codigo) {
      this.mostrarPopUp.set(false)
      this.mostrarPortalPopUp.set(true)
    } else {
      console.log("has introducido mal el codigo")
    }
  }


  async onConfirmarPortal(codigo: string) {

    if (!codigo.includes('-')) {
      console.error('El formato debe ser "portal-piso", como "2-2B".');
      return;
    }

    const partes = codigo.split('-');

    if (partes.length !== 2 || !partes[0] || !partes[1]) {
      console.error('Formato inválido. Debe ser algo como "2-2B".');
      return;
    }

    this.portal = partes[0].trim();
    this.piso = partes[1].trim();
    if(this.perfil().comunidad){
      this.cambio = true
      this.mostrarConfirmacionPopUp.set(true)
    }else{
      this.unirseComunidad(this.portal, this.piso)
    }
    
    this.mostrarPortalPopUp.set(false)
    

  }
  onCerrarPopup() {
    this.mostrarPopUp.set(false);
  }
  onCerrarPortalPopup() {
    this.mostrarPortalPopUp.set(false);
  }
  async unirseComunidad(portal: string, piso: string) {
    await this.usuarioService.modificarComunidadaUsuario(this.comunidadSeleccionada.id, this.perfil().id, portal, piso)
    this.mostrarPortalPopUp.set(false)
  }
  onCerrarConfirmacionPopup() {
    this.mostrarConfirmacionPopUp.set(false)
  }
  async onConfirmar() {
    const datos = { portal: null, piso: null, rol: null, comunidad_id: null }
    await this.usuarioService.modificarPerfil(datos);
    console.log(this.cambio)
    if (this.cambio) {
      await this.unirseComunidad(this.portal, this.piso)
      this.cambio=false
    }
    this.mostrarConfirmacionPopUp.set(false)

  }
     async puedeAbandonar(idComunidad:any): Promise<boolean> {
    const administradores = await this.comunidadService.obtenerAdministradores(idComunidad);
    console.log(administradores,'administradores :')
    return !(this.perfil().rol == 'administrador' && administradores.length <= 1);
  }
}
