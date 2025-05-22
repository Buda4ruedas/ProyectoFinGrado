import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../Services/usuario.service';
import { Router, RouterModule } from '@angular/router';
import { ImagenesService } from '../../Services/imagenes.service';
import { AutenticacionService } from '../../Services/autenticacion.service';

@Component({
  selector: 'app-completar-perfil',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './completar-perfil.component.html',
  styleUrl: './completar-perfil.component.css'
})
export class CompletarPerfilComponent {
  imagenesService = inject (ImagenesService)
  autenticacionService = inject (AutenticacionService)
  perfil = this.autenticacionService.perfilSignal

  formulario: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private route: Router) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fotografia: ['', Validators.required]
    });

  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];

      // Aquí solo seteamos el nombre del archivo para el formulario, no la URL aún
      this.formulario.get('fotografia')?.setValue(this.selectedFile?.name);
    }
  }

  async onSubmit() {
    if (this.formulario.valid) {
      const datos = this.formulario.value;

      // Subimos la imagen si se ha seleccionado un archivo
      if (this.selectedFile) {
        try {
          const path = `${this.perfil().id}/${this.selectedFile.name}`;
          const imageUrl = await this.imagenesService.subirImagen(this.selectedFile, path);
          datos.fotografia = imageUrl; 
        } catch (error) {
          console.error('Error al subir la imagen:', error);
          return;
        }
      }

      this.usuarioService.modificarPerfil(datos);
      console.log('Perfil actualizado:', datos);

      this.route.navigate(['/navbar/principal']);
    } else {
      this.formulario.markAllAsTouched();
    }
  }
}
