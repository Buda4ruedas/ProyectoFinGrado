import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosPendientesComponent } from './usuarios-pendientes.component';

describe('UsuariosPendientesComponent', () => {
  let component: UsuariosPendientesComponent;
  let fixture: ComponentFixture<UsuariosPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosPendientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
