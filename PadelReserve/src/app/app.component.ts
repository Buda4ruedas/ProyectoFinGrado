import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './Core/login/login.component';
import { AutenticacionService } from './Services/autenticacion.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AutenticacionService,private router : Router) {}

  ngOnInit(): void {
    this.authService.recoverSession().then(() => {
      // Aquí es cuando la sesión ha sido completamente recuperada
      this.authService.user$.pipe(take(1)).subscribe(user => {
        if (user) {
          // La sesión está recuperada, puedes continuar
          this.router.navigate(['/navbar/principal']);
        } else {
          // No hay usuario, redirige al login
          this.router.navigate(['']);
        }
      });
    });
  }
}
