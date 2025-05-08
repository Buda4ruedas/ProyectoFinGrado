import { Component, signal } from '@angular/core';
import { supabase } from '../../app.config';
import { CommonModule } from '@angular/common';
import { ComunidadComponent } from "../../Shared/comunidad/comunidad.component";
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PopUpCodigoComunidadComponent } from '../../Shared/pop-up-codigo-comunidad/pop-up-codigo-comunidad.component';
import { UsuarioService } from '../../Services/usuario.service';
import { AutenticacionService } from '../../Services/autenticacion.service';


@Component({
  selector: 'app-buscar-comunidad',
  imports: [CommonModule, ComunidadComponent, FormsModule,PopUpCodigoComunidadComponent],
  templateUrl: './buscar-comunidad.component.html',
  styleUrl: './buscar-comunidad.component.css'
})
export class BuscarComunidadComponent {
  filtro = '';
  comunidades = signal<any[]>([]);
  comunidadesFiltradas = signal<any[]>([]);
  codigo: string = '';
  comunidadSeleccionada: any;
  mostrarPopUp=signal<boolean>(false);
  mostrarPortalPopUp =signal<boolean>(false);
  perfil=signal<any>(null);
  loading = signal<boolean>(true);

  constructor(private usuarioService:UsuarioService,private autenticacionService:AutenticacionService){
    this.autenticacionService.profile$.subscribe(perfil => {
      if (perfil) {
        this.perfil.set(perfil)
      }});
  }



  async ngOnInit() {
    const { data, error } = await supabase.from('comunidad').select('*');
    if (!error && data) {
      this.comunidades.set(data);
      this.comunidadesFiltradas.set(data);
    }
    setTimeout(()=>{
      this.loading.set(false);
    },500)
  
  }

  filtrar() {
    this.loading.set(true);  // Muestra el spinner

    
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

  onUnirse(comunidad: any) {
    this.comunidadSeleccionada = comunidad;
    if (this.comunidadSeleccionada.seguridad === 'publica') {
      this.mostrarPortalPopUp.set(true)
    } else {
      this.mostrarPopUp.set(true);
      
    }
  }

   onConfirmarCodigo(codigo:string){
    if(this.comunidadSeleccionada.codigo_acceso==codigo){
      this.mostrarPopUp.set(false)
      this.mostrarPortalPopUp.set(true)
    }else{
      console.log("has introducido mal el codigo")
    }
  }
  async onConfirmarPortal(codigo:string){

    if (!codigo.includes('-')) {
    console.error('El formato debe ser "portal-piso", como "2-2B".');
    return;
  }

  const partes = codigo.split('-');

  if (partes.length !== 2 || !partes[0] || !partes[1]) {
    console.error('Formato inválido. Debe ser algo como "2-2B".');
    return;
  }

  const portal = partes[0].trim();
  const piso = partes[1].trim();

  console.log('Portal:', portal);
  console.log('Piso:', piso);
    this.unirseComunidad(portal,piso)
    this.mostrarPopUp.set(false)

  }
  onCerrarPopup(){
    this.mostrarPopUp.set(false);
  }
  onCerrarPortalPopup(){
    this.mostrarPortalPopUp.set(false);
  }


  async unirseComunidad(portal:string,piso:string) {
   await this.usuarioService.modificarComunidadaUsuario(this.comunidadSeleccionada.id,this.perfil().id,portal,piso)
   this.mostrarPortalPopUp.set(false)
  }
}
