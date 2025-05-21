import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { ReservasService } from '../../Services/reservas.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { CalendarioService } from '../../Services/calendario.service';
import { PartidosService } from '../../Services/partidos.service';

@Component({
  selector: 'app-crear-partido',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './crear-partido.component.html',
  styleUrl: './crear-partido.component.css'
})
export class CrearPartidoComponent {
  partidoForm: FormGroup;
  private reservasService= inject (ReservasService)
  private fb = inject( FormBuilder)
  private autenticationService= inject(AutenticacionService)
  private calendarioService=inject(CalendarioService)
  private partidosService= inject(PartidosService)

  perfil = this.autenticationService.perfilSignal
  horasInicio:string[]=[]
  horasFinal:string[]=[]

  constructor() {
    this.partidoForm = this.fb.group({
      nivel: ['', Validators.required],
      genero: ['', Validators.required],
      jugadores: ['', Validators.required],
      fecha: ['', Validators.required],
      hora_inicio:['',Validators.required],
      hora_fin: ['',Validators.required],
    });

    this.partidoForm.get('fecha')?.valueChanges.subscribe(fecha => {
      if (fecha) {
        this.cargarhorasInicio(fecha);
      }
    });
    this.partidoForm.get('hora_inicio')?.valueChanges.subscribe(horaInicio => {
      if (horaInicio) {
        this.cargarhorasFinal(horaInicio);
      }
    });

  }

 async  onSubmit(): Promise<void> {
    if (this.partidoForm.valid) {
      const datos = this.partidoForm.value;
     const idPartido = await this.partidosService.guardarUnpartido(datos,this.perfil().id)
     console.log(idPartido)
     await this.partidosService.insertarEquipo(idPartido.id,this.perfil().id,1)
     this.partidoForm.reset();
    }
  }

  async cargarhorasFinal(horaInicio:string){
    this.horasFinal = [];

    const horaInicioMinutos = this.pasarAminutos(horaInicio);
  
    this.horasInicio.forEach(resp => {
      const horaFinalMinutos = this.pasarAminutos(resp);
  
      if (horaFinalMinutos > horaInicioMinutos && horaFinalMinutos < horaInicioMinutos + 120) {
        const nuevaHora = this.sumarMinutos(resp, 30); // suma 30 min
        this.horasFinal.push(nuevaHora);
      }
    });
  }
  pasarAminutos(horaInicio:string):number{
    const [h, m] = horaInicio.split(':').map(Number);
  return h * 60 + m;
  }




  async cargarhorasInicio(fecha:string){
    this.horasInicio=[]
  const idCalendario= await this.cargaridPadel();
  const horasDisponibles  = (await this.cargarTodasHoras(idCalendario)).filter(resp=> fecha==resp.fecha)
    
    horasDisponibles.forEach(element=>{
      this.horasInicio.push(element.horario)
    })
    console.log(this.horasInicio)

  }

  async cargaridPadel():Promise<string>{
    const calendarios = await this.calendarioService.obtenerCalendarios(this.perfil().comunidad.id)
    let idCalendarioPadel:string='';
     calendarios.forEach(element => {
      if(element.nombre=='Padel')
        idCalendarioPadel=element.id;
    });
    return idCalendarioPadel
  }
  async cargarTodasHoras(idCalendario:string):Promise<{nombre:string,calendario:string,horario:string,fecha:string}[]>{
    const horas = await this.reservasService.obtenerReservas(this.perfil().id)
    const horasPadel = horas.filter(resp=>resp.calendarioId==idCalendario)
    return horasPadel
  }
  sumarMinutos(hora: string, minutosASumar: number): string {
    const [h, m] = hora.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(h);
    fecha.setMinutes(m + minutosASumar);
  
    const horasFinal = fecha.getHours().toString().padStart(2, '0');
    const minutosFinal = fecha.getMinutes().toString().padStart(2, '0');
    return `${horasFinal}:${minutosFinal}`;
  }
  



}
