import { TestBed } from '@angular/core/testing';

import { SKY_LOG_LEVEL } from '../../../injection-tokens';

import { SkyLogService } from './log.service';
import { SkyLogLevel } from './types/log-level';

describe('Log service', () => {
  let logService: SkyLogService;

  describe('no provider', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [SkyLogService],
      });
      logService = TestBed.inject(SkyLogService);
    });

    it('should log errors to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.error('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test', undefined);
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log info to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.info('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log wanrings to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.warn('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.',
        undefined
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
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
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.error('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test', undefined);
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log info to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.info('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log wanrings to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.warn('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.',
        undefined
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
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
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.error('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test', undefined);
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log info to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.info('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log wanrings to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.warn('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Test', undefined);
    });

    it('should log deprecations to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.',
        undefined
      );
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.',
        undefined
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
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
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.error('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Test', undefined);
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log info to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.info('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Test', undefined);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log wanrings to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.warn('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Test', undefined);
    });

    it('should log deprecations to the console', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.',
        undefined
      );
    });

    it('should log deprecations to the console when `SkyLogLevel.Error` is given', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Error,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.',
        undefined
      );
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should log deprecations to the console when `SkyLogLevel.Info` is given', () => {
      const consoleDebugSpy = spyOn(console, 'debug');
      const consoleErrorSpy = spyOn(console, 'error');
      const consoleInfoSpy = spyOn(console, 'info');
      const consoleLogSpy = spyOn(console, 'log');
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('Test', {
        logLevel: SkyLogLevel.Info,
      });
      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '`Test` is deprecated. We will remove it in a future major version.',
        undefined
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
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('TestType');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated. We will remove it in a future major version.',
        undefined
      );
    });

    it('should log deprecations with a type and depcrecation version given correctly', () => {
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('TestType', {
        depcrecationVersion: '6.0.0',
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated starting in SKY UX 6.0.0. We will remove it in a future major version.',
        undefined
      );
    });

    it('should log deprecations with a type and removal version given correctly', () => {
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('TestType', {
        removalVersion: '7.0.0',
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated. We will remove it in version 7.0.0.',
        undefined
      );
    });

    it('should log deprecations with a type and replacment type given correctly', () => {
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('TestType', {
        replacementType: '`TestReplacementType`',
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated. We will remove it in a future major version. We recommend `TestReplacementType` instead.',
        undefined
      );
    });

    it('should log deprecations with a type and url given correctly', () => {
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('TestType', {
        url: 'tar.dis',
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated. We will remove it in a future major version. For more information, see tar.dis.',
        undefined
      );
    });

    it('should log deprecations with all possible values given correctly', () => {
      const consoleWarnSpy = spyOn(console, 'warn');
      logService.deprecated('TestType', {
        depcrecationVersion: '6.0.0',
        removalVersion: '7.0.0',
        replacementType: 'TestReplacementType',
        url: 'tar.dis',
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '`TestType` is deprecated starting in SKY UX 6.0.0. We will remove it in version 7.0.0. We recommend `TestReplacementType` instead. For more information, see tar.dis.',
        undefined
      );
    });
  });
});
