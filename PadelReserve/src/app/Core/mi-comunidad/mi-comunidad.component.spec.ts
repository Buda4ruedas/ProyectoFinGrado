import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiComunidadComponent } from './mi-comunidad.component';

describe('MiComunidadComponent', () => {
  let component: MiComunidadComponent;
  let fixture: ComponentFixture<MiComunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiComunidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiComunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
