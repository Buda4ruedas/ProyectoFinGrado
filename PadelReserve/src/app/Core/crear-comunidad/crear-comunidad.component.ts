import { Component, effect, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ComunidadService } from '../../Services/comunidad.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { PopUpCodigoComunidadComponent } from '../../Shared/pop-up-codigo-comunidad/pop-up-codigo-comunidad.component';
import { ReservasService } from '../../Services/reservas.service';
import { CalendarioService } from '../../Services/calendario.service';
import { Router } from '@angular/router';
import { ImagenesService } from '../../Services/imagenes.service';

@Component({
  selector: 'app-crear-comunidad',
  imports: [ReactiveFormsModule,PopUpCodigoComunidadComponent],
  templateUrl: './crear-comunidad.component.html',
  styleUrl: './crear-comunidad.component.css'
})
export class CrearComunidadComponent {
  private route= inject(Router)
  private comunidadServices= inject(ComunidadService)
  private autenticationService= inject(AutenticacionService)
  private reservasService= inject (ReservasService)
  private fb = inject(FormBuilder) 
  private imagenesService = inject(ImagenesService)


  comunidadForm!: FormGroup;
  perfil = this.autenticationService.perfilSignal
  popUp=false;
  datos:any=null
  horasDisponibles: any = null;
  datosCalendario:any=null;
  selectedFile: File | null = null;


  ngOnInit(): void {
    this.comunidadForm = this.fb.group({
      nombre: ['', Validators.required],
      cp: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      poblacion: ['', Validators.required],
      provincia: ['', Validators.required],
      direccion: ['', Validators.required],
      seguridad: ['', Validators.required],
      codigoAcceso: [null],
      fotografia: [''],
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
    if (this.comunidadForm.valid&&this.selectedFile) {
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
  try{   
    const portal = partes[0].trim();
    const piso = partes[1].trim();
    const id = await this.comunidadServices.crearComunidad(this.datos,this.perfil().id,portal,piso)
    console.log("lo que responde es ", id)

    const path = `${id}/${this.selectedFile!.name}`;
    const imageUrl = await this.imagenesService.subirImagen(this.selectedFile!, path,"fotoscomunidad");
    await this.comunidadServices.actualizarFotoComunidad(id,imageUrl!) 
       

  this.popUp=false
  this.route.navigate(['/navbar/principal'])

  }catch{
    console.log('error en el sistema')
    this.popUp=false
  }

  }

  crearCalendario(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      horaInicioFinde:['',Validators.required],
      horaFinFinde:['',Validators.required]
    }, { validators: this.validarHoras });
  }
  validarHoras(group: FormGroup): { [key: string]: any } | null {
    const inicio = group.get('horaInicio')?.value;
    const fin = group.get('horaFin')?.value;
    const inicioFinde = group.get('horaInicioFinde')?.value;
    const finFinde = group.get('horaFinFinde')?.value;
  
    if (!inicio || !fin) return null;
  
    return inicio >= fin || inicioFinde>=finFinde ? { horaInvalida: true } : null;
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
    onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      this.comunidadForm.get('fotografia')?.setValue(this.selectedFile?.name);
    }
  }
  
}
