import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { zonaUsuariosGuard } from './zona-usuarios.guard';

describe('zonaUsuariosGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => zonaUsuariosGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
