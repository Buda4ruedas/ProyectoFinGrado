import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { sinRolGuard } from './sin-rol.guard';

describe('sinRolGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => sinRolGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
