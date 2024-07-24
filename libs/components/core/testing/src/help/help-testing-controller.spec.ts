import { TestBed } from '@angular/core/testing';
import { SkyHelpService } from '@skyux/core';

import { lastValueFrom } from 'rxjs';

import { SkyHelpTestingController } from './help-testing-controller';
import { SkyHelpTestingModule } from './help-testing.module';

describe('Help testing controller', () => {
  let helpSvc: SkyHelpService;
  let helpController: SkyHelpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyHelpTestingModule],
    });

    helpSvc = TestBed.inject(SkyHelpService);
    helpController = TestBed.inject(SkyHelpTestingController);
  });

  it('should validate current help key', () => {
    helpSvc.openHelp({ helpKey: 'test' });

    helpController.expectCurrentHelpKey('test');
  });

  it('should throw an error when the current help key does not match the expected help key', () => {
    helpSvc.openHelp({ helpKey: 'test' });

    helpController.expectCurrentHelpKey('test');

    expect(() => helpController.expectCurrentHelpKey('test2')).toThrowError(
      `Expected current help key to be 'test2', but the current help key is 'test'.`,
    );

    expect(() => helpController.expectCurrentHelpKey(undefined)).toThrowError(
      `Expected current help key to be undefined, but the current help key is 'test'.`,
    );
  });

  it('should close help', () => {
    helpSvc.openHelp({ helpKey: 'test' });

    helpController.expectCurrentHelpKey('test');

    helpController.closeHelp();

    helpController.expectCurrentHelpKey(undefined);

    expect(() => helpController.expectCurrentHelpKey('test')).toThrowError(
      `Expected current help key to be 'test', but the current help key is undefined.`,
    );
  });

  it('should initialize the widget "ready state" to true', async () => {
    await expectAsync(
      lastValueFrom(helpSvc.widgetReadyStateChange),
    ).toBeResolvedTo(true);
  });
});
