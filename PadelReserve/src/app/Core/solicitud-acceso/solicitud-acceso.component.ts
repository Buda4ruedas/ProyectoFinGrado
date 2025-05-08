import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-solicitud-acceso',
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './solicitud-acceso.component.html',
  styleUrl: './solicitud-acceso.component.css'
})
export class SolicitudAccesoComponent {
  formulario: FormGroup;

  constructor(private fb: FormBuilder,private route : Router) {
    this.formulario = this.fb.group({
      comunidad: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      const datos = this.formulario.value;
      console.log('Datos del formulario:', datos);
     
      alert('Solicitud enviada correctamente. En unos dias recibiras un email con tus credenciales');
      this.formulario.reset();
      this.route.navigate([''])
    } else {
      this.formulario.markAllAsTouched(); // Muestra los errores si el usuario no llenó todo
    }
  }
}
