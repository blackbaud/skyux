import { TestBed } from '@angular/core/testing';

import { SkyHelpService } from './help.service';

describe('Help service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyHelpService],
    });
  });

  it('should throw an error if injected directly', () => {
    const helpService = TestBed.inject(SkyHelpService);

    expect(() =>
      helpService.openHelp({
        helpKey: 'test',
      }),
    ).toThrowError();
  });
});
