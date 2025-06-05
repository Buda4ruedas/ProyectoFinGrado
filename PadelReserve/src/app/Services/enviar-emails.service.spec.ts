import { TestBed } from '@angular/core/testing';

import { EnviarEmailsService } from './enviar-emails.service';

describe('EnviarEmailsService', () => {
  let service: EnviarEmailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnviarEmailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
