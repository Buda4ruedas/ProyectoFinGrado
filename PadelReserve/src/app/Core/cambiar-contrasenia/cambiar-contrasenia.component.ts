import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AutenticacionService } from '../../Services/autenticacion.service';

@Component({
  selector: 'app-cambiar-contrasenia',
  imports: [ReactiveFormsModule],
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrl: './cambiar-contrasenia.component.css'
})
export class CambiarContraseniaComponent {
 form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService
  ) {
    this.form = this.fb.group({
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required]
    });
  }

  async cambiarPassword() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const { nuevaPassword, confirmarPassword } = this.form.value;

    if (nuevaPassword !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const exito = await this.authService.cambiarPassword(nuevaPassword);

    if (exito) {
      alert('Contraseña cambiada correctamente.');
    } else {
      alert('Error al cambiar la contraseña.');
    }
  }
}
