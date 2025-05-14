import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionComunidadComponent } from './gestion-comunidad.component';

describe('GestionComunidadComponent', () => {
  let component: GestionComunidadComponent;
  let fixture: ComponentFixture<GestionComunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionComunidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionComunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
