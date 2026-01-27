import { TestBed } from '@angular/core/testing';
import { SkyHelpOpenArgs, SkyHelpUpdateArgs } from '@skyux/core';

import { ExampleHelpService } from './help.service';

describe('ExampleHelpService', () => {
  let service: ExampleHelpService;
  let consoleLogSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExampleHelpService],
    });

    service = TestBed.inject(ExampleHelpService);
    consoleLogSpy = spyOn(console, 'log');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openHelp', () => {
    it('should log help key when args are provided', () => {
      const args: SkyHelpOpenArgs = { helpKey: 'test-help-key' };

      service.openHelp(args);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Help opened with key 'test-help-key'.",
      );
    });

    it('should log help key as undefined when args are not provided', () => {
      service.openHelp();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Help opened with key 'undefined'.",
      );
    });
  });

  describe('updateHelp', () => {
    it('should not throw when called with args', () => {
      const args: SkyHelpUpdateArgs = {
        helpKey: 'test-key',
        pageDefaultHelpKey: 'default-key',
      };

      expect(() => service.updateHelp(args)).not.toThrow();
    });

    it('should not perform any action when called', () => {
      const args: SkyHelpUpdateArgs = {
        helpKey: 'test-key',
      };

      service.updateHelp(args);

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});
