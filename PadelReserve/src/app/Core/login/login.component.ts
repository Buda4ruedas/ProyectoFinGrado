import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { observable, Observable } from 'rxjs';
import { UsuarioService } from '../../Services/usuario.service';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorLogin = signal<string | null>(null);
  private authService = inject(AutenticacionService) 
  perfil = this.authService.perfilSignal
  private usuariosService = inject( UsuarioService)
  private router= inject(Router) 
  
  private fb = inject (FormBuilder)
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

  }
  async onLogin() {
  this.errorLogin.set(null);

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const { email, password } = this.loginForm.value;
  const resultado = await this.authService.login(email, password);

  if (!resultado.success) {
    this.errorLogin.set(resultado.mensaje);
    return;
  }
  this.router.navigate(['/navbar/principal']);
}
  async recuperarContrasenia(){
    const datos = this.loginForm.value
    if(datos.email){
      const existe = await this.usuariosService.usuarioYaRegistrado(datos.email)
      if(existe){
        await this.authService.recuperarContrasenia(datos.email)
        console.log('se ha enviado una nueva contraseña al correo')
      }else{
        console.log("El correo introducido es erroneo")
      }
    }else{
      console.log("debes introducir un correo electronico")
    }
  }

}
