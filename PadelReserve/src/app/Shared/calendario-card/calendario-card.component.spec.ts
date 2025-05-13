import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioCardComponent } from './calendario-card.component';

describe('CalendarioCardComponent', () => {
  let component: CalendarioCardComponent;
  let fixture: ComponentFixture<CalendarioCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
