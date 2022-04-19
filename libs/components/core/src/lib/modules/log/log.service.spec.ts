import { TestBed } from '@angular/core/testing';

import { SkyLogService } from './log.service';
import { SkyLogLevel } from './types/log-level';
import { SKY_LOG_LEVEL } from './types/log-level-token';

describe('Log service', () => {
  let consoleDebugSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;
  let consoleInfoSpy: jasmine.Spy;
  let consoleLogSpy: jasmine.Spy;
  let consoleWarnSpy: jasmine.Spy;
  let logService: SkyLogService;

  function setupSpys(): void {
    consoleDebugSpy = spyOn(console, 'debug');
    consoleErrorSpy = spyOn(console, 'error');
    consoleInfoSpy = spyOn(console, 'info');
    consoleLogSpy = spyOn(console, 'log');
    consoleWarnSpy = spyOn(console, 'warn');
  }

  beforeEach(() => {
    setupSpys();
  });

  describe('no provider', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [SkyLogService],
      });
      logService = TestBed.inject(SkyLogService);
    });

    it('should log errors to the console', () => {
      logService.error('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test');
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log errors to the console with parameters', () => {
      logService.error('Test {0} {1}', ['foo', 'bar']);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Test {0} {1}',
        'foo',
        'bar'
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log info to the console', () => {
      logService.info('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log warnings to the console', () => {
      logService.warn('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console', () => {
      logService.deprecated('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Info,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('`SkyLogLevel.Error` provider', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SkyLogService,
          { provide: SKY_LOG_LEVEL, useValue: SkyLogLevel.Error },
        ],
      });
      logService = TestBed.inject(SkyLogService);
    });

    it('should log errors to the console', () => {
      logService.error('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test');
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log errors to the console with parameters', () => {
      logService.error('Test {0} {1}', ['foo', 'bar']);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Test {0} {1}',
        'foo',
        'bar'
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log info to the console', () => {
      logService.info('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log warnings to the console', () => {
      logService.warn('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console', () => {
      logService.deprecated('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Info,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('`SkyLogLevel.Warn` provider', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SkyLogService,
          { provide: SKY_LOG_LEVEL, useValue: SkyLogLevel.Warn },
        ],
      });
      logService = TestBed.inject(SkyLogService);
    });

    it('should log errors to the console', () => {
      logService.error('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test');
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log errors to the console with parameters', () => {
      logService.error('Test {0} {1}', ['foo', 'bar']);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Test {0} {1}',
        'foo',
        'bar'
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log info to the console', () => {
      logService.info('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log warnings to the console', () => {
      logService.warn('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Test');
    });

    it('should log warnings to the console with parameters', () => {
      logService.warn('Test {0} {1}', ['foo', 'bar']);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Test {0} {1}', 'foo', 'bar');
    });

    it('should log deprecations to the console', () => {
      logService.deprecated('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Info,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('`SkyLogLevel.Info` provider', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SkyLogService,
          { provide: SKY_LOG_LEVEL, useValue: SkyLogLevel.Info },
        ],
      });
      logService = TestBed.inject(SkyLogService);
    });

    it('should log errors to the console', () => {
      logService.error('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test');
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log errors to the console with parameters', () => {
      logService.error('Test {0} {1}', ['foo', 'bar']);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Test {0} {1}',
        'foo',
        'bar'
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log info to the console', () => {
      logService.info('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Test');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log info to the console with parameters', () => {
      logService.info('Test {0} {1}', ['foo', 'bar']);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Test {0} {1}', 'foo', 'bar');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log warnings to the console', () => {
      logService.warn('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Test');
    });

    it('should log warnings to the console with parameters', () => {
      logService.warn('Test {0} {1}', ['foo', 'bar']);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Test {0} {1}', 'foo', 'bar');
    });

    it('should log deprecations to the console', () => {
      logService.deprecated('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Info,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('deprecations', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SkyLogService,
          { provide: SKY_LOG_LEVEL, useValue: SkyLogLevel.Warn },
        ],
      });
      logService = TestBed.inject(SkyLogService);
    });

    it('should log deprecations with only a type given correctly', () => {
      logService.deprecated('TestType');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated. We will remove it in a future major version.'
      );
    });

    it('should log deprecations with a type and depcrecation version given correctly', () => {
      logService.deprecated('TestType', {
        deprecationMajorVersion: 6,
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated starting in SKY UX 6. We will remove it in a future major version.'
      );
    });

    it('should log deprecations with a type and removal version given correctly', () => {
      logService.deprecated('TestType', {
        removalMajorVersion: 7,
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated. We will remove it in version 7.'
      );
    });

    it('should log deprecations with a type and replacment type given correctly', () => {
      logService.deprecated('TestType', {
        replacementRecommendation:
          'We recommend `TestReplacementType` instead.',
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated. We will remove it in a future major version. We recommend `TestReplacementType` instead.'
      );
    });

    it('should log deprecations with a type and url given correctly', () => {
      logService.deprecated('TestType', {
        moreInfoUrl: 'tar.dis',
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated. We will remove it in a future major version. For more information, see tar.dis.'
      );
    });

    it('should log deprecations with all possible values given correctly', () => {
      logService.deprecated('TestType', {
        deprecationMajorVersion: 6,
        removalMajorVersion: 7,
        replacementRecommendation:
          'We recommend `TestReplacementType` instead.',
        moreInfoUrl: 'tar.dis',
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated starting in SKY UX 6. We will remove it in version 7. We recommend `TestReplacementType` instead. For more information, see tar.dis.'
      );
    });
  });
});
