import { Component, effect, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PartidosService } from '../../Services/partidos.service';
import { AutenticacionService } from '../../Services/autenticacion.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-buscar-partidos',
  imports: [ReactiveFormsModule],
  templateUrl: './buscar-partidos.component.html',
  styleUrl: './buscar-partidos.component.css'
})
export class BuscarPartidosComponent {
  private fb = inject(FormBuilder);
  private partidosService = inject(PartidosService)
  private autenticacionService = inject(AutenticacionService)
  private router = inject(Router)

  data = signal<any[]>([]);
  perfil=this.autenticacionService.perfilSignal
  buscarForm: FormGroup;
  formMandado = false;
  loading = false;
  completo: boolean[] = [];
  jugadoresApuntados: number[] = [];


  constructor() {
    this.buscarForm = this.fb.group({
      actividad: ['Padel', Validators.required],
      jugadores: ['', Validators.required],
      genero: ['', Validators.required],
      nivel: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.buscarForm.valid) {
      const datos = this.buscarForm.value;
      this.formMandado = false;
      this.loading = true;
      

      this.partidosFiltrados(datos).then(() => {
        this.formMandado = true;
        this.loading = false;
      });
    }
  }

  async partidosFiltrados(datos: any) {
    this.completo = [];
    this.data.set([]);

    try {
      const partidos = await this.partidosService.obtenerPartidos();
      const partidosFiltrados: any[] = [];

      const filtroBase = (resp: any) => resp.numero_jugadores == datos.jugadores;

      const fechaHoy = new Date();
      fechaHoy.setHours(0, 0, 0, 0);

      for (const resp of partidos) {
        if (!filtroBase(resp)) continue;

        const generoMatch = datos.genero === 'Cualquiera' || resp.genero.toLowerCase() === datos.genero.toLowerCase();
        const nivelMatch = datos.nivel === 'Cualquiera' || resp.nivel.toLowerCase() === datos.nivel.toLowerCase();

        const fechaPartido = new Date(resp.fecha);
        if (fechaPartido < fechaHoy) continue;

        if (generoMatch && nivelMatch) {
          try {
            const apuntados = await this.partidosService.obtenerJugadoresPartido(resp.id);
            resp.jugadores_apuntados = apuntados.length;
            this.completo.push(apuntados.length >= resp.numero_jugadores);
            partidosFiltrados.push(resp);
          } catch (error) {
            alert('Error al obtener jugadores del partido:');
          }
        }
      }
      this.data.set(partidosFiltrados);
    } catch (error) {
      alert('Error al obtener partidos:')
    }
  }

  apuntarme(idPartido: number) {
    this.router.navigate([`/navbar/partido/${idPartido}`]);
  }
}