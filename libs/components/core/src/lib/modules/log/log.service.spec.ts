import { TestBed, inject } from '@angular/core/testing';

import { SkyLogService } from './log.service';

describe('Log service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyLogService],
    });
  });

  it('should log warnings to the console', inject(
    [SkyLogService],
    (logService: SkyLogService) => {
      const warnSpy = spyOn(window.console, 'warn');

      logService.warn('This is the message', 'an optional parameter');

      expect(warnSpy).toHaveBeenCalledWith(
        'This is the message',
        'an optional parameter'
      );
    }
  ));
});
