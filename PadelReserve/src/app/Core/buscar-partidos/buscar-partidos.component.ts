import { Component, signal } from '@angular/core';
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
  data = signal<any[]>([]);
  userId: string = '';
  buscarForm: FormGroup;
  formMandado = false;
  loading = false;
  completo: boolean[] = [];
  jugadoresApuntados: number[] = [];

  constructor(
    private fb: FormBuilder,
    private partidosService: PartidosService,
    private autenticacionService: AutenticacionService,
    private router: Router
  ) {
    this.buscarForm = this.fb.group({
      actividad: ['Padel', Validators.required],
      jugadores: ['', Validators.required],
      genero: ['', Validators.required],
      nivel: ['', Validators.required]
    });

    this.autenticacionService.profile$.subscribe(perfil => {
      if (perfil) {
        this.userId = perfil.id;
      }
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
    const partidos = await this.partidosService.obtenerPartidos();
    const partidosFiltrados: any[] = [];

    const filtroBase = (resp: any) => resp.usuario.id !== this.userId && resp.numero_jugadores == datos.jugadores;

    for (const resp of partidos) {
      if (!filtroBase(resp)) continue;

      const generoMatch = datos.genero === 'Cualquiera' || resp.genero.toLowerCase() === datos.genero.toLowerCase();
      const nivelMatch = datos.nivel === 'Cualquiera' || resp.nivel.toLowerCase() === datos.nivel.toLowerCase();

      if (generoMatch && nivelMatch) {
        const apuntados = await this.partidosService.obtenerJugadoresPartido(resp.id);
        resp.jugadores_apuntados = apuntados.length;
        this.completo.push(apuntados.length >= resp.numero_jugadores);
        partidosFiltrados.push(resp);
      }
    }

    this.data.set(partidosFiltrados);
  }

  apuntarme(idPartido: number) {
    this.router.navigate([`/navbar/partido/${idPartido}`]);
  }
}