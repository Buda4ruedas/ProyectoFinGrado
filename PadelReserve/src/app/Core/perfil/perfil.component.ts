import { Component, effect, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { CommonModule } from '@angular/common';
import { supabase } from '../../app.config';
import { UsuarioService } from '../../Services/usuario.service';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  perfilForm: FormGroup;
  perfil = signal<any>(null)
  nombreComunidad:string='';
  

  constructor(private authService: AutenticacionService, private fb: FormBuilder,private usuarioService : UsuarioService) {
    effect(() => {
      const perfil = this.authService.perfilSignal()
      if(perfil){
        this.perfil.set(perfil)
        this.nombreComunidad = perfil.comunidad?.nombre;
        this.perfilForm.patchValue({
          nombre: perfil.nombre,
          email: perfil.email,
          apellidos:perfil.apellidos,
          portal: perfil?.portal,
          piso: perfil?.piso,
          fotografia:perfil.fotografia,
          comunidad:perfil.comunidad?.id
        });

      }
    })
    this.perfilForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      portal: [{value:'', disabled:true}, Validators.required],
      piso: [{value:'', disabled:true}, Validators.required],
      fotografia: ['', Validators.required],
      comunidad: [{value:'', disabled:true}, Validators.required],

    });
  }

  guardarCambios() {
    if (this.perfilForm.valid) {
      const datos = this.perfilForm.value;
      this.usuarioService.modificarPerfil(datos);
    }
  }
}
