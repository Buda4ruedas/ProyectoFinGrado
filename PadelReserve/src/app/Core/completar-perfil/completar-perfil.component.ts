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
  private imagenesService = inject(ImagenesService);
  private autenticacionService = inject(AutenticacionService);
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private route = inject(Router);

  perfil = this.autenticacionService.perfilSignal;

  formulario: FormGroup;
  selectedFile: File | null = null;

  constructor() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fotografia: ['', Validators.required]
    });
  }

 onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input?.files?.length) {
    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('❌ Solo se permiten archivos de imagen (jpg, png, webp).');
      this.selectedFile = null;
      this.formulario.get('fotografia')?.setValue('');
      return;
    }

    this.selectedFile = file;
    this.formulario.get('fotografia')?.setValue(file.name);
  }
}

  async onSubmit() {
    if (this.formulario.valid) {
      const datos = this.formulario.value;

      if (this.selectedFile) {
        try {
          const path = `${this.perfil().id}/${this.selectedFile.name}`;
          const imageUrl = await this.imagenesService.subirImagen(this.selectedFile, path, "fotosperfil");
          datos.fotografia = imageUrl;
        } catch (error) {
          console.error('Error al subir la imagen:', error);
          alert('❌ Error al subir la imagen. Intenta de nuevo.');
          return;
        }
      }

      try {
        await this.usuarioService.modificarPerfil(datos);
        console.log('Perfil actualizado:', datos);
        this.route.navigate(['/navbar/principal']);
      } catch (error) {
        console.error('Error al modificar el perfil:', error);
        alert('❌ Error al actualizar el perfil. Intenta más tarde.');
      }
    } else {
      this.formulario.markAllAsTouched();
    }
  }
}
