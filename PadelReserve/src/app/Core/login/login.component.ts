import { Component } from '@angular/core';
import { FormBuilder, FormsModule, Validators,ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { observable, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet,ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  
  usuario$;
  perfil$ ;

  constructor(
    private router: Router,
    private authService: AutenticacionService,
    private fb: FormBuilder
  ) {
 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.usuario$ = this.authService.user$;
    this.perfil$ = this.authService.profile$;
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); 
      return;
    }

    const { email, password } = this.loginForm.value;
    const exito = await this.authService.login(email, password);

    if (!exito) {
      console.error("No se ha podido iniciar sesión");
    } else {
      
      this.usuario$.subscribe(usuario => {
        this.perfil$.subscribe(perfil => {
          if (perfil && perfil?.nombre && usuario) {
            this.router.navigate(['/navbar/principal']);
          } else if (usuario && !perfil?.nombre) {
            this.router.navigate(['/navbar/completarPerfil']);
          }
        });
      });
    }
  }

}
