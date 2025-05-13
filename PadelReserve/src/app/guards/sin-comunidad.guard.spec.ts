import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { sinComunidadGuard } from './sin-comunidad.guard';

describe('sinComunidadGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => sinComunidadGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
