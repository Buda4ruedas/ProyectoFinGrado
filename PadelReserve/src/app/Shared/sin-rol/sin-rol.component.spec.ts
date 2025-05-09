import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinRolComponent } from './sin-rol.component';

describe('SinRolComponent', () => {
  let component: SinRolComponent;
  let fixture: ComponentFixture<SinRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinRolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
