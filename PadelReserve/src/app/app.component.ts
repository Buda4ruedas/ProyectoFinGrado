import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AutenticacionService } from './Services/autenticacion.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  cargando = signal(true);

  constructor(private authService: AutenticacionService, private router: Router) {}

  ngOnInit(): void {
    this.authService.recoverSession().then(() => {
      this.authService.profile$.pipe(take(1)).subscribe(user => {
        if (user) {
          this.router.navigate(['/navbar/principal']);
        } else {
          this.router.navigate(['']);
        }
        this.cargando.set(false);
      });
    });
  }
}
