import { TestBed } from '@angular/core/testing';

import { SkyLogService } from './log.service';
import { SkyLogLevel } from './types/log-level';
import { SKY_LOG_LEVEL } from './types/log-level-token';

describe('Log service', () => {
  let consoleSpy: jasmine.SpyObj<Console>;
  let logService: SkyLogService;

  beforeEach(() => {
    // Normally we want warnings to only be shown once per browser session,
    // but for testing the log service we need to clear out previous warnings
    // between tests to validate that functionality.
    SkyLogService.clearPreviousLogs();

    consoleSpy = spyOnAllFunctions(console);
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
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith('Test');
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should log errors to the console with parameters', () => {
      logService.error('Test {0} {1}', ['foo', 'bar']);
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith(
        'Test {0} {1}',
        'foo',
        'bar'
      );
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should not log info to the console', () => {
      logService.info('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should not log warnings to the console', () => {
      logService.warn('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console', () => {
      logService.deprecated('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Info,
      });
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
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
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith('Test');
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should log errors to the console with parameters', () => {
      logService.error('Test {0} {1}', ['foo', 'bar']);
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith(
        'Test {0} {1}',
        'foo',
        'bar'
      );
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should not log info to the console', () => {
      logService.info('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should not log warnings to the console', () => {
      logService.warn('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console', () => {
      logService.deprecated('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Info,
      });
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
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
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith('Test');
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should log errors to the console with parameters', () => {
      logService.error('Test {0} {1}', ['foo', 'bar']);
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith(
        'Test {0} {1}',
        'foo',
        'bar'
      );
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should not log info to the console', () => {
      logService.info('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should log warnings to the console', () => {
      logService.warn('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith('Test');
    });

    it('should log warnings to the console with parameters', () => {
      logService.warn('Test {0} {1}', ['foo', 'bar']);
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith(
        'Test {0} {1}',
        'foo',
        'bar'
      );
    });

    it('should log deprecations to the console', () => {
      logService.deprecated('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Info,
      });
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should only log the same deprecation message once per application instance', () => {
      logService.deprecated('Test');
      logService.deprecated('Test');

      expect(consoleSpy.warn).toHaveBeenCalledOnceWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
    });

    it('should only log the same deprecation message once per application instance', () => {
      logService.warn('Test');
      logService.warn('Test');

      expect(consoleSpy.warn).toHaveBeenCalledOnceWith('Test');
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
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith('Test');
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should log errors to the console with parameters', () => {
      logService.error('Test {0} {1}', ['foo', 'bar']);
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith(
        'Test {0} {1}',
        'foo',
        'bar'
      );
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should log info to the console', () => {
      logService.info('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).toHaveBeenCalledOnceWith('Test');
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should log info to the console with parameters', () => {
      logService.info('Test {0} {1}', ['foo', 'bar']);
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).toHaveBeenCalledOnceWith(
        'Test {0} {1}',
        'foo',
        'bar'
      );
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should log warnings to the console', () => {
      logService.warn('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith('Test');
    });

    it('should log warnings to the console with parameters', () => {
      logService.warn('Test {0} {1}', ['foo', 'bar']);
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith(
        'Test {0} {1}',
        'foo',
        'bar'
      );
    });

    it('should log deprecations to the console', () => {
      logService.deprecated('Test');
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledOnceWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('should log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Info,
      });
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.log).toHaveBeenCalledOnceWith(
        '`Test` is deprecated. We will remove it in a future major version.'
      );
      expect(consoleSpy.warn).not.toHaveBeenCalled();
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
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith(
        '`TestType` is deprecated. We will remove it in a future major version.'
      );
    });

    it('should log deprecations with a type and deprecation version given correctly', () => {
      logService.deprecated('TestType', {
        deprecationMajorVersion: 6,
      });
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith(
        '`TestType` is deprecated starting in SKY UX 6. We will remove it in a future major version.'
      );
    });

    it('should log deprecations with a type and removal version given correctly', () => {
      logService.deprecated('TestType', {
        removalMajorVersion: 7,
      });
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith(
        '`TestType` is deprecated. We will remove it in version 7.'
      );
    });

    it('should log deprecations with a type and replacement type given correctly', () => {
      logService.deprecated('TestType', {
        replacementRecommendation:
          'We recommend `TestReplacementType` instead.',
      });
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith(
        '`TestType` is deprecated. We will remove it in a future major version. We recommend `TestReplacementType` instead.'
      );
    });

    it('should log deprecations with a type and url given correctly', () => {
      logService.deprecated('TestType', {
        moreInfoUrl: 'tar.dis',
      });
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith(
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
      expect(consoleSpy.warn).toHaveBeenCalledOnceWith(
        '`TestType` is deprecated starting in SKY UX 6. We will remove it in version 7. We recommend `TestReplacementType` instead. For more information, see tar.dis.'
      );
    });
  });
});
