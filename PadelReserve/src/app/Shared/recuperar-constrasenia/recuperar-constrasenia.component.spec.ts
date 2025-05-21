import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarConstraseniaComponent } from './recuperar-constrasenia.component';

describe('RecuperarConstraseniaComponent', () => {
  let component: RecuperarConstraseniaComponent;
  let fixture: ComponentFixture<RecuperarConstraseniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarConstraseniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperarConstraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
