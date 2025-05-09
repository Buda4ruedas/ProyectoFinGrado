import { Component } from '@angular/core';
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
  perfil$: Observable<any>;
  nombreComunidad:string='';
  

  constructor(private authService: AutenticacionService, private fb: FormBuilder,private usuarioService : UsuarioService) {
    this.perfil$ = this.authService.profile$;
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

  ngOnInit() {
    this.perfil$.subscribe((perfilData) => {
      if (perfilData) {
        console.log(perfilData)
        this.nombreComunidad = perfilData.comunidad?.nombre;
        this.perfilForm.patchValue({
          nombre: perfilData.nombre,
          email: perfilData.email,
          apellidos:perfilData.apellidos,
          portal: perfilData?.portal,
          piso: perfilData?.piso,
          fotografia:perfilData.fotografia,
          comunidad:perfilData.comunidad?.id
        });
      }
    });
  }

  
  guardarCambios() {
    if (this.perfilForm.valid) {
      const datos = this.perfilForm.value;
      this.usuarioService.modificarPerfil(datos);
    }
  }
}
