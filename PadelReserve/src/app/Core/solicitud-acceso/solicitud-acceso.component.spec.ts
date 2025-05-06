import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudAccesoComponent } from './solicitud-acceso.component';

describe('SolicitudAccesoComponent', () => {
  let component: SolicitudAccesoComponent;
  let fixture: ComponentFixture<SolicitudAccesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudAccesoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudAccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
