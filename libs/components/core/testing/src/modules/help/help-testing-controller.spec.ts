import { TestBed } from '@angular/core/testing';
import { SkyHelpService } from '@skyux/core';

import { firstValueFrom } from 'rxjs';

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

  it('should validate current help key when a page default is used', () => {
    helpSvc.updateHelp({ pageDefaultHelpKey: 'test-page' });
    helpSvc.openHelp();

    helpController.expectCurrentHelpKey('test-page');
  });

  it('should validate current help key when a page default and open key is used', () => {
    helpSvc.updateHelp({ pageDefaultHelpKey: 'test-page' });
    helpSvc.openHelp({ helpKey: 'test' });

    helpController.expectCurrentHelpKey('test');
  });

  it('should validate current help key when it is updated', () => {
    helpSvc.openHelp({ helpKey: 'test' });
    helpSvc.updateHelp({ helpKey: 'updated-test' });

    helpController.expectCurrentHelpKey('updated-test');
  });

  it('should validate current help key when it is cleared via an update', () => {
    helpSvc.updateHelp({ pageDefaultHelpKey: 'test-page' });
    helpSvc.openHelp({ helpKey: 'test' });
    helpSvc.updateHelp({ helpKey: undefined });

    helpController.expectCurrentHelpKey('test-page');
  });

  it('should validate current help key when the current key and page default are cleared via an update', () => {
    helpSvc.updateHelp({ pageDefaultHelpKey: 'test-page' });
    helpSvc.openHelp({ helpKey: 'test' });
    helpSvc.updateHelp({ helpKey: undefined, pageDefaultHelpKey: undefined });

    helpController.expectCurrentHelpKey(undefined);
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

  it('should close help with a page default', () => {
    helpSvc.updateHelp({ pageDefaultHelpKey: 'page-test' });
    helpSvc.openHelp({ helpKey: 'test' });

    helpController.expectCurrentHelpKey('test');

    helpController.closeHelp();

    helpController.expectCurrentHelpKey('page-test');

    expect(() => helpController.expectCurrentHelpKey('test')).toThrowError(
      `Expected current help key to be 'test', but the current help key is 'page-test'.`,
    );
  });

  it('should close help and reopen with a page default', () => {
    helpSvc.updateHelp({ pageDefaultHelpKey: 'page-test' });
    helpSvc.openHelp({ helpKey: 'test' });

    helpController.expectCurrentHelpKey('test');

    helpController.closeHelp();

    helpController.expectCurrentHelpKey('page-test');

    expect(() => helpController.expectCurrentHelpKey('test')).toThrowError(
      `Expected current help key to be 'test', but the current help key is 'page-test'.`,
    );

    helpSvc.openHelp();

    helpController.expectCurrentHelpKey('page-test');

    expect(() => helpController.expectCurrentHelpKey('test')).toThrowError(
      `Expected current help key to be 'test', but the current help key is 'page-test'.`,
    );
  });

  it('should set widget ready state to "true" on init', async () => {
    await expectAsync(
      firstValueFrom(helpSvc.widgetReadyStateChange),
    ).toBeResolvedTo(true);
  });
});
