import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearComunidadComponent } from './crear-comunidad.component';

describe('CrearComunidadComponent', () => {
  let component: CrearComunidadComponent;
  let fixture: ComponentFixture<CrearComunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearComunidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearComunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
