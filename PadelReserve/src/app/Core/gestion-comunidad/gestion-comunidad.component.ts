import { Component, effect, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ComunidadService } from '../../Services/comunidad.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { Router } from '@angular/router';

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
  comunidadForm: FormGroup;
  perfil = this.autenticationService.perfilSignal
  comunidad = signal<any>(null)

  constructor() {
    this.comunidadForm = this.fb.group({
      nombre: ['', Validators.required],
      cp: ['', Validators.required],
      poblacion: ['', Validators.required],
      provincia: ['', Validators.required],
      direccion: ['', Validators.required],
      seguridad: ['', Validators.required],
      codigoAcceso: [null]
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
    await this.obtenerComunidad()
  }

  async guardarComunidad() {
    if (this.comunidadForm.valid) {
      await this.comunidadService.actualizarComunidad(this.perfil().comunidad.id, this.comunidadForm.value);
      await this.obtenerComunidad()
      alert('Comunidad actualizada correctamente.');
    }
  }

  async eliminarComunidad() {
    if (confirm('¿Estás seguro de que deseas eliminar esta comunidad?')) {
      await this.comunidadService.eliminarComunidad(this.perfil().comunidad.id);
      await this.autenticationService.loadProfile(this.perfil().id)
      this.router.navigate(['navbar/principal'])

      alert('Comunidad eliminada.');
    }
  }
  async obtenerComunidad(): Promise<void> {
    const comunidad = await this.comunidadService.obtenerComunidad(this.perfil().comunidad.id);
    this.comunidad.set(comunidad)
    if (this.comunidad()) {
      this.comunidadForm.patchValue({
        nombre: comunidad.nombre,
        cp: comunidad.cp,
        poblacion: comunidad.poblacion,
        provincia: comunidad.provincia,
        direccion: comunidad.direccion,
        seguridad: comunidad.seguridad,
        codigoAcceso: comunidad.codigoAcceso || null,
      });
    }
  }
}
