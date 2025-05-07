import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCodigoComunidadComponent } from './pop-up-codigo-comunidad.component';

describe('PopUpCodigoComunidadComponent', () => {
  let component: PopUpCodigoComunidadComponent;
  let fixture: ComponentFixture<PopUpCodigoComunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpCodigoComunidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpCodigoComunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
