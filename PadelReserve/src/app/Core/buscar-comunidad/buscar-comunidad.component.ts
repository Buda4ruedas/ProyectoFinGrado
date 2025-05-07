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
  perfil=signal<any>(null);

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
  }

  filtrar() {
    const f = this.filtro.toLowerCase();
    console.log('el filtro es ', this.filtro)
    const resultados = this.comunidades().filter(c =>
      c.nombre.toLowerCase().includes(f) ||
      c.direccion.toLowerCase().includes(f) ||
      c.poblacion.toLowerCase().includes(f) ||
      c.provincia.toLowerCase().includes(f)
    );
    this.comunidadesFiltradas.set(resultados);
  }

  onUnirse(comunidad: any) {
    this.comunidadSeleccionada = comunidad;
    if (this.comunidadSeleccionada.seguridad === 'publica') {
      this.unirseComunidad();
    } else {
      this.mostrarPopUp.set(true);
      
    }
  }

  async onConfirmarCodigo(codigo:string){
    if(this.comunidadSeleccionada.codigo_acceso==codigo){
      await this.unirseComunidad()
      this.mostrarPopUp.set(false)
    }else{
      console.log("has introducido mal el codigo")
    }
  }
  onCerrarPopup(){
    this.mostrarPopUp.set(false);
  }


  async unirseComunidad() {
   await this.usuarioService.modificarComunidad(this.comunidadSeleccionada.id,this.perfil().id)
  }
}
