import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPartidoComponent } from './crear-partido.component';

describe('CrearPartidoComponent', () => {
  let component: CrearPartidoComponent;
  let fixture: ComponentFixture<CrearPartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPartidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
