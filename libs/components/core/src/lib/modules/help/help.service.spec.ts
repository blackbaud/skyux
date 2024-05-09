import { TestBed } from '@angular/core/testing';

import { SkyHelpService } from './help.service';

describe('Help service', () => {
  it('should log a warning to the console if no global help implementation is provided', () => {
    const consoleSpy = spyOn(console, 'warn');

    const helpService = TestBed.inject(SkyHelpService);

    helpService.openHelp({
      helpKey: 'test',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Global help is not implemented for this application.',
    );
  });
});
