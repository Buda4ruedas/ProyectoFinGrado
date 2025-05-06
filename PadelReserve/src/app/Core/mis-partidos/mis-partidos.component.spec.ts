import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPartidosComponent } from './mis-partidos.component';

describe('MisPartidosComponent', () => {
  let component: MisPartidosComponent;
  let fixture: ComponentFixture<MisPartidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisPartidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisPartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
