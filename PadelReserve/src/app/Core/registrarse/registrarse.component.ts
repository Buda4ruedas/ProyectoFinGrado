import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../Services/autenticacion.service';

@Component({
  selector: 'app-registrarse',
  imports: [ReactiveFormsModule],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css'
})
export class RegistrarseComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required],
    });
  }

  async onRegistro() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const { email, password, confirmarPassword } = this.registroForm.value;

    if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const exito = await this.authService.registro(email, password);

    if (exito) {
      alert('Registro exitoso. Revisa tu correo para verificar tu cuenta.');
      this.router.navigate(['/login']);
    } else {
      alert('Error al registrarse. Revisa los datos e intenta nuevamente.');
    }
  }
}
