import { Component, effect, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ComunidadService } from '../../Services/comunidad.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { Router } from '@angular/router';
import { ImagenesService } from '../../Services/imagenes.service';

@Component({
  selector: 'app-gestion-comunidad',
  imports: [ReactiveFormsModule],
  templateUrl: './gestion-comunidad.component.html',
  styleUrl: './gestion-comunidad.component.css'
})
export class GestionComunidadComponent {
  private fb = inject(FormBuilder)
  private comunidadService = inject(ComunidadService)
  private autenticationService = inject(AutenticacionService)
  private router = inject(Router)
  private imagenesService = inject(ImagenesService)
  comunidadForm: FormGroup;
  perfil = this.autenticationService.perfilSignal
  comunidad = signal<any>(null)
  archivoSeleccionado: File | null = null;

  constructor() {
    this.comunidadForm = this.fb.group({
      nombre: ['', Validators.required],
      cp: ['', Validators.required],
      poblacion: ['', Validators.required],
      provincia: ['', Validators.required],
      direccion: ['', Validators.required],
      seguridad: ['', Validators.required],
      codigoAcceso: [null],
      fotografia:['',Validators.required]
    });

    this.comunidadForm.get('seguridad')?.valueChanges.subscribe(valor => {
      const codigoAccesoControl = this.comunidadForm.get('codigoAcceso');
      if (valor === 'privada') {
        codigoAccesoControl?.setValidators([Validators.required]);
      } else {
        codigoAccesoControl?.clearValidators();
        codigoAccesoControl?.setValue(null);
      }
      codigoAccesoControl?.updateValueAndValidity();
    });
  }
 async ngOnInit() {
  try {
    await this.obtenerComunidad();
  } catch (error) {
    console.error('Error al cargar la comunidad:', error);
    alert('Error al cargar la comunidad');
  }
}

onArchivoSeleccionado(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.archivoSeleccionado = input.files[0];
  }
}

async guardarComunidad() {
  if (this.comunidadForm.valid) {
    const datos = this.comunidadForm.value;

    try {
      if (this.archivoSeleccionado) {
        const path = `${this.comunidad().id}/${this.archivoSeleccionado.name}`;
        const imageUrl = await this.imagenesService.subirImagen(this.archivoSeleccionado, path, 'fotoscomunidad');
        datos.fotografia = imageUrl;
      }

      await this.comunidadService.actualizarComunidad(this.perfil().comunidad.id, datos);
      await this.obtenerComunidad();
      alert('Comunidad actualizada correctamente.');
      this.archivoSeleccionado = null;
    } catch (error) {
      console.error('Error al guardar la comunidad:', error);
      alert('Error al guardar los datos de la comunidad');
    }
  } else {
    alert('Por favor, completa todos los campos requeridos.');
  }
}

async eliminarComunidad() {
  if (confirm('¿Estás seguro de que deseas eliminar esta comunidad?')) {
    try {
      await this.comunidadService.eliminarComunidad(this.perfil().comunidad.id);
      await this.autenticationService.loadProfile(this.perfil().id);
      this.router.navigate(['navbar/principal']);
      alert('Comunidad eliminada.');
    } catch (error) {
      console.error('Error al eliminar la comunidad:', error);
      alert('Hubo un error al eliminar la comunidad');
    }
  }
}

async obtenerComunidad(): Promise<void> {
  try {
    const comunidad = await this.comunidadService.obtenerComunidad(this.perfil().comunidad.id);
    this.comunidad.set(comunidad);

    if (comunidad) {
      this.comunidadForm.patchValue({
        nombre: comunidad.nombre,
        cp: comunidad.cp,
        poblacion: comunidad.poblacion,
        provincia: comunidad.provincia,
        direccion: comunidad.direccion,
        seguridad: comunidad.seguridad,
        codigoAcceso: comunidad.codigoAcceso || null,
        fotografia: comunidad.fotografia
      });
    }
  } catch (error) {
    console.error('Error al obtener la comunidad:', error);
    alert('No se pudo obtener la información de la comunidad');
  }
}
}
