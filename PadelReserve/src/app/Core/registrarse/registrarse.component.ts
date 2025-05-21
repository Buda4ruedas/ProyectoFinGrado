import { Component, EventEmitter, inject, Output, output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { UsuarioService } from '../../Services/usuario.service';

@Component({
  selector: 'app-registrarse',
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css'
})
export class RegistrarseComponent {
  registroForm: FormGroup;
  errorLogin: string | null = null;
  private usuarioService = inject (UsuarioService)
  private fb = inject(FormBuilder)
  private authService = inject(AutenticacionService)
  @Output() usuarioRegistrado = new EventEmitter<any>()

  constructor() {
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
    this.errorLogin = 'Las contraseñas no coinciden';
    return;
  }
  const registrado = await this.usuarioService.usuarioYaRegistrado(email)
  if(registrado){
    alert("Este correo ya esta registrado")
    this.registroForm.reset
    
  }else{
      const resultado = await this.authService.registro(email, password);

  if (resultado.success) {
    alert(resultado.mensaje);  
    this.usuarioRegistrado.emit()
  } else {
    alert(resultado.mensaje);  
  }
  }
}




}
