import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarPartidosComponent } from './buscar-partidos.component';

describe('BuscarPartidosComponent', () => {
  let component: BuscarPartidosComponent;
  let fixture: ComponentFixture<BuscarPartidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarPartidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarPartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
