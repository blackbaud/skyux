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
          '{0} is deprecated starting in SKY UX {1}.'
            .replace('{0}', type)
            .replace('{1}', args.depcrecationVersion)
        );
      } else {
        localizedStrings.push('{0} is deprecated.'.replace('{0}', type));
      }

      if (args?.removalVersion) {
        localizedStrings.push(
          'We will remove it in version {0}.'.replace(
            '{0}',
            args.removalVersion
          )
        );
      } else {
        localizedStrings.push('We will remove it in a future major version.');
      }

      if (args?.replacementType) {
        localizedStrings.push(
          'We recommend {0} instead.'.replace('{0}', args.replacementType)
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
