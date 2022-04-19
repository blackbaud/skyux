import { Inject, Injectable, Optional } from '@angular/core';

import { SkyAppFormat } from '../format/app-format';

import { SkyLogDeprecationArgs } from './types/log-deprecation-args';
import { SkyLogLevel } from './types/log-level';
import { SKY_LOG_LEVEL } from './types/log-level-token';

/**
 * Logs information to the console based on the application's log level as provided by the `SKY_LOG_LEVEL` injection token. If no token is provided, only `error` logs will be shown.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyLogService {
  constructor(
    private formatter: SkyAppFormat,
    @Optional()
    @Inject(SKY_LOG_LEVEL)
    private applicationLogLevel: SkyLogLevel
  ) {
    if (!this.applicationLogLevel) {
      this.applicationLogLevel = SkyLogLevel.Error;
    }
  }

  /**
   * Logs a deprecation warning for a class, property, function, etc. This will be logged as a console warning unless a different log level is given in the the `args` parameter.
   * @param name The name of the deprecated class, property, function, etc.
   * @param args Information about the deprecation and replacement recommendations.
   * @returns
   */
  public async deprecated(
    name: string,
    args?: SkyLogDeprecationArgs
  ): Promise<void> {
    const logLevel = args?.logLevel ?? SkyLogLevel.Warn;
    name = this.convertStringToCode(name);

    if (this.canLog(logLevel)) {
      const localizedStrings = [];

      if (args?.deprecationMajorVersion) {
        localizedStrings.push(
          this.formatter.formatText(
            '{0} is deprecated starting in SKY UX {1}.',
            name,
            args.deprecationMajorVersion.toLocaleString()
          )
        );
      } else {
        localizedStrings.push(
          this.formatter.formatText('{0} is deprecated.', name)
        );
      }

      if (args?.removalMajorVersion) {
        localizedStrings.push(
          this.formatter.formatText(
            'We will remove it in version {0}.',
            args.removalMajorVersion.toLocaleString()
          )
        );
      } else {
        localizedStrings.push('We will remove it in a future major version.');
      }

      if (args?.replacementRecommendation) {
        localizedStrings.push(args.replacementRecommendation);
      }

      if (args?.moreInfoUrl) {
        localizedStrings.push(
          this.formatter.formatText(
            'For more information, see {0}.',
            args.moreInfoUrl
          )
        );
      }

      this.logBasedOnLevel(logLevel, localizedStrings.join(' '));
    }
    return Promise.resolve();
  }

  /**
   * Logs a console error if the application's log level is `SkyLogLevel.Error`.
   * @param message The error message
   * @param params Optional parameters for the error message.
   */
  public error(message: string, params?: unknown[]): void {
    if (this.canLog(SkyLogLevel.Error)) {
      if (params) {
        console.error(message, ...params);
      } else {
        console.error(message);
      }
    }
  }

  /**
   * Logs console information if the application's log level is `SkyLogLevel.Info` or above.
   * @param message The infomational message
   * @param params Optional parameters for the informational message.
   */
  public info(message: string, params?: unknown[]): void {
    if (this.canLog(SkyLogLevel.Info)) {
      if (params) {
        console.log(message, ...params);
      } else {
        console.log(message);
      }
    }
  }

  /**
   * Logs a console warning if the application's log level is `SkyLogLevel.Warn` or above.
   * @param message The warning message
   * @param params Optional parameters for the warning message.
   */
  public warn(message: string, params?: unknown[]): void {
    if (this.canLog(SkyLogLevel.Warn)) {
      if (params) {
        console.warn(message, ...params);
      } else {
        console.warn(message);
      }
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
