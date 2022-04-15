import { Inject, Injectable, Optional } from '@angular/core';

import { SKY_LOG_LEVEL } from '../../../injection-tokens';

import { SkyLogDepcrecationArgs } from './types/log-deprecation-args';
import { SkyLogLevel } from './types/log-level';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyLogService {
  constructor(
    @Optional()
    @Inject(SKY_LOG_LEVEL)
    private applicationLogLevel: SkyLogLevel
  ) {
    if (!this.applicationLogLevel) {
      this.applicationLogLevel = SkyLogLevel.Error;
    }
  }

  public async deprecated(
    type: string,
    args?: SkyLogDepcrecationArgs
  ): Promise<void> {
    const logLevel = args?.logLevel ?? SkyLogLevel.Warn;
    type = this.convertStringToCode(type);

    if (args?.replacementType) {
      args.replacementType = this.convertStringToCode(args.replacementType);
    }

    if (this.canLog(logLevel)) {
      const localizedStrings = [];

      if (args?.depcrecationVersion) {
        localizedStrings.push(
          'Since version {0},'.replace('{0}', args.depcrecationVersion)
        );
      }

      if (!args?.removalVersion) {
        localizedStrings.push(
          '{0} has been deprecated and will be removed in a future major version of SKY UX.'.replace(
            '{0}',
            type
          )
        );
      } else {
        localizedStrings.push(
          '{0} has been deprecated and will be removed in version {1} of SKY UX.'
            .replace('{0}', type)
            .replace('{1}', args.removalVersion)
        );
      }

      if (args?.replacementType) {
        localizedStrings.push(
          'We recommend you use {0} instead.'.replace(
            '{0}',
            args.replacementType
          )
        );
      }

      if (args?.url) {
        localizedStrings.push(
          'For more information, see {0}.'.replace('{0}', args.url)
        );
      }

      this.logBasedOnLevel(logLevel, localizedStrings.join(' '));
    }
    return Promise.resolve();
  }

  public error(message: string, params?: unknown[]): void {
    if (this.canLog(SkyLogLevel.Error)) {
      console.error(message, params);
    }
  }

  public info(message: string, params?: unknown[]): void {
    if (this.canLog(SkyLogLevel.Info)) {
      // eslint-disable-next-line no-restricted-syntax
      console.log(message, params);
    }
  }

  public warn(message: string, params?: unknown[]): void {
    if (this.canLog(SkyLogLevel.Warn)) {
      console.warn(message, params);
    }
  }

  private convertStringToCode(typeString: string): string {
    if (typeString.charAt(0) !== '`' && typeString.charAt(-1) !== '`') {
      typeString = '`' + typeString + '`';
    }
    return typeString;
  }

  private canLog(intendedLogLevel: SkyLogLevel): boolean {
    return intendedLogLevel >= this.applicationLogLevel;
  }

  private logBasedOnLevel(
    logLevel: SkyLogLevel,
    message: string,
    params?: unknown[]
  ): void {
    switch (logLevel) {
      case SkyLogLevel.Info:
        this.info(message, params);
        break;
      case SkyLogLevel.Warn:
        this.warn(message, params);
        break;
      case SkyLogLevel.Error:
        this.error(message, params);
        break;
    }
  }
}
