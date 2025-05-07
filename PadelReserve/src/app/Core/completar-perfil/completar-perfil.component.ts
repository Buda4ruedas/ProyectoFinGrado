import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../Services/usuario.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-completar-perfil',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './completar-perfil.component.html',
  styleUrl: './completar-perfil.component.css'
})
export class CompletarPerfilComponent {
  formulario: FormGroup;
  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private route: Router) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      fotografia: ['', Validators.required]
    });

  }
  onSubmit() {
    if (this.formulario.valid) {
      const datos = this.formulario.value;
      this.usuarioService.modificarPerfil(datos);
      console.log('paso')
      this.formulario.reset();
      this.route.navigate(['/navbar/principal'])
      console.log("No he podido ir a la ruta")

    } else {
      this.formulario.markAllAsTouched();
    }
  }

}
