import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasActivasComponent } from './reservas-activas.component';

describe('ReservasActivasComponent', () => {
  let component: ReservasActivasComponent;
  let fixture: ComponentFixture<ReservasActivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasActivasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
