import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustesComunidadComponent } from './ajustes-comunidad.component';

describe('AjustesComunidadComponent', () => {
  let component: AjustesComunidadComponent;
  let fixture: ComponentFixture<AjustesComunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjustesComunidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjustesComunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
