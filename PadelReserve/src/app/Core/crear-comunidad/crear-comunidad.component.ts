import { Component, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ComunidadService } from '../../Services/comunidad.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { PopUpCodigoComunidadComponent } from '../../Shared/pop-up-codigo-comunidad/pop-up-codigo-comunidad.component';
import { ReservasService } from '../../Services/reservas.service';
import { CalendarioService } from '../../Services/calendario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-comunidad',
  imports: [ReactiveFormsModule,PopUpCodigoComunidadComponent],
  templateUrl: './crear-comunidad.component.html',
  styleUrl: './crear-comunidad.component.css'
})
export class CrearComunidadComponent {
  comunidadForm!: FormGroup;
  perfil = signal<any>(null)
  popUp=false;
  datos:any=null
  horasDisponibles: string[] = [];
  datosCalendario:any=null;

  constructor(private fb: FormBuilder,
    private route:Router,
    private comunidadServices:ComunidadService,
    private autenticationService:AutenticacionService,
    private reservasService:ReservasService,
    ) {
    this.autenticationService.profile$.subscribe(perfil=>{
      this.perfil.set(perfil)
    })
  }

  ngOnInit(): void {
    this.comunidadForm = this.fb.group({
      nombre: ['', Validators.required],
      cp: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      poblacion: ['', Validators.required],
      provincia: ['', Validators.required],
      direccion: ['', Validators.required],
      seguridad: ['', Validators.required],
      codigoAcceso: [null],
      calendarios: this.fb.array([this.crearCalendario()])
    });

    this.comunidadForm.get('seguridad')?.valueChanges.subscribe(value => {
      const codigoControl = this.comunidadForm.get('codigoAcceso');
      if (value === 'privada') {
        codigoControl?.setValidators([Validators.required]);
      } else {
        codigoControl?.clearValidators();
        codigoControl?.setValue(null);
      }
      codigoControl?.updateValueAndValidity();
    });
    this.cargarHoras();
  }

  onSubmit(): void {
    if (this.comunidadForm.valid) {
      console.log(this.comunidadForm.value);
      this.datos = this.comunidadForm.value
      this.datosCalendario = this.datos.calendario
      this.popUp=true
    }
  }
  onCerrarPopup(){
    this.popUp=false
  }
 async onConfirmarCodigo(codigo:string){ 
    
    if (!codigo.includes('-')) {
    console.error('El formato debe ser "portal-piso", como "2-2B".');
    return;
  }

  const partes = codigo.split('-');

  if (partes.length !== 2 || !partes[0] || !partes[1]) {
    console.error('Formato inválido. Debe ser algo como "2-2B".');
    return;
  }

   const portal = partes[0].trim();
    const piso = partes[1].trim();
    await this.comunidadServices.crearComunidad(this.datos,this.perfil().id,portal,piso)
  this.popUp=false
  this.route.navigate(['/navbar/principal'])
  }

  crearCalendario(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required]
    }, { validators: this.validarHoras });
  }
  validarHoras(group: FormGroup): { [key: string]: any } | null {
    const inicio = group.get('horaInicio')?.value;
    const fin = group.get('horaFin')?.value;
  
    if (!inicio || !fin) return null;
  
    return inicio >= fin ? { horaInvalida: true } : null;
  }

  agregarCalendario(): void {
    this.calendarios.push(this.crearCalendario());
  }
  get calendarios(): FormArray {
    return this.comunidadForm.get('calendarios') as FormArray;
  }
  eliminarCalendario(index: number): void {
    if (this.calendarios.length > 1) {
      this.calendarios.removeAt(index);
    }
  }
  cargarHoras(): void {
    this.reservasService.obtenerHorarios().then(horas => {
      this.horasDisponibles = horas; 
    });
  }
  
}
