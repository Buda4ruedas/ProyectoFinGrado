import { Component, Input} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-calendario-card',
  imports: [RouterModule],
  templateUrl: './calendario-card.component.html',
  styleUrl: './calendario-card.component.css'
})
export class CalendarioCardComponent {
@Input() nombre:any = ''
@Input() enlace:any=''
}
