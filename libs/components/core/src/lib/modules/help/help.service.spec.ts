import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

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

  it('should default widget ready state to false', async () => {
    const helpService = TestBed.inject(SkyHelpService);

    await expectAsync(
      firstValueFrom(helpService.widgetReadyStateChange),
    ).toBeResolvedTo(false);
  });
});
