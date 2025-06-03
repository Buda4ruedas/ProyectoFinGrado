import { Component, effect, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { CommonModule } from '@angular/common';

import { UsuarioService } from '../../Services/usuario.service';
import { ImagenesService } from '../../Services/imagenes.service';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  private authService= inject( AutenticacionService)
  private fb = inject ( FormBuilder)
  private usuarioService = inject( UsuarioService)
  private imagenesService = inject(ImagenesService)

  perfilForm: FormGroup;
  perfil = this.authService.perfilSignal
  nombreComunidad:string='';
  selectedFile: File | null = null;
  

    constructor() {
    this.perfilForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      portal: [{ value: '', disabled: true }, Validators.required],
      piso: [{ value: '', disabled: true }, Validators.required],
      fotografia: ['', Validators.required],
      comunidad_id: [{ value: '', disabled: true }, Validators.required],
    });
        this.nombreComunidad = this.perfil().comunidad?.nombre ?? '';
        this.perfilForm.patchValue({
          nombre: this.perfil().nombre,
          email: this.perfil().email,
          apellidos: this.perfil().apellidos,
          portal: this.perfil().portal,
          piso: this.perfil().piso,
          fotografia: this.perfil().fotografia,
          comunidad_id: this.perfil().comunidad?.id

        })
 
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      this.perfilForm.patchValue({
        fotografia: this.selectedFile.name
      });
    }
  }

  async guardarCambios() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const datos = this.perfilForm.getRawValue();

    try {
      if (this.selectedFile) {
        const path = `${this.perfil().id}/${this.selectedFile.name}`;
        const imageUrl = await this.imagenesService.subirImagen(this.selectedFile, path, 'fotosperfil');
        datos.fotografia = imageUrl;
      }
      console.log("Los datos son los siguientes" , datos)
      await this.usuarioService.modificarPerfil(datos);
      alert('Perfil actualizado correctamente.');
    } catch (error) {
      console.error('Error al guardar los cambios del perfil:', error);
      alert('Ocurrió un error al guardar los cambios. Inténtalo de nuevo más tarde.');
    }
  }
}