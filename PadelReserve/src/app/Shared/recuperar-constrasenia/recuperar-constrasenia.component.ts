import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { supabase } from '../../app.config';

@Component({
  selector: 'app-recuperar-constrasenia',
  imports: [ReactiveFormsModule],
  templateUrl: './recuperar-constrasenia.component.html',
  styleUrl: './recuperar-constrasenia.component.css'
})
export class RecuperarConstraseniaComponent {
  resetForm!: FormGroup;
  error: string = '';
  accessToken: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.accessToken = this.route.snapshot.queryParamMap.get('access_token');

    if (!this.accessToken) {
      this.error = 'Token inválido o expirado.';
      return;
    }

    // Establecer sesión con token (usamos "hack" para evitar error TS)
    supabase.auth.setSession({
      access_token: this.accessToken,
      refresh_token: ''  // cadena vacía para evitar error TS
    } as any).catch(() => {
      this.error = 'No se pudo establecer la sesión con el token.';
    });
  }

  async onResetPassword() {
    if (this.resetForm.invalid) return;

    const { password, confirmPassword } = this.resetForm.value;

    if (password !== confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    if (!this.accessToken) {
      this.error = 'Token no válido.';
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      this.error = error.message;
      return;
    }

    alert('Contraseña cambiada con éxito. Ya puedes iniciar sesión.');
    this.router.navigate(['/login']);
  }
}
