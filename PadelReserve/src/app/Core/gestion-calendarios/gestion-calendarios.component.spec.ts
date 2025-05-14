import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCalendariosComponent } from './gestion-calendarios.component';

describe('GestionCalendariosComponent', () => {
  let component: GestionCalendariosComponent;
  let fixture: ComponentFixture<GestionCalendariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCalendariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCalendariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
