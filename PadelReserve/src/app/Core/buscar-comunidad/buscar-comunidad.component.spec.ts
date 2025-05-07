import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarComunidadComponent } from './buscar-comunidad.component';

describe('BuscarComunidadComponent', () => {
  let component: BuscarComunidadComponent;
  let fixture: ComponentFixture<BuscarComunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarComunidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarComunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
