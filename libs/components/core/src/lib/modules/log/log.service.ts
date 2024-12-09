import { Inject, Injectable, Optional } from '@angular/core';

import { SkyAppFormat } from '../format/app-format';

import { SkyLogDeprecatedArgs } from './types/log-deprecation-args';
import { SkyLogLevel } from './types/log-level';
import { SKY_LOG_LEVEL } from './types/log-level-token';

const previousWarnings = new Set<string>();

/**
 * Logs information to the console based on the application's log level as
 * provided by the `SKY_LOG_LEVEL` injection token. If no token is provided,
 * only `error` logs will be shown.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyLogService {
  #applicationLogLevel: SkyLogLevel;

  #formatter: SkyAppFormat;

  constructor(
    formatter: SkyAppFormat,
    @Optional()
    @Inject(SKY_LOG_LEVEL)
    applicationLogLevel?: SkyLogLevel,
  ) {
    this.#formatter = formatter;
    this.#applicationLogLevel = applicationLogLevel ?? SkyLogLevel.Error;
  }

  /**
   * Clears previously-logged messages. Primarily used for unit
   * testing this service.
   */
  public static clearPreviousLogs(): void {
    previousWarnings.clear();
  }

  /**
   * Logs a deprecation warning for a class, property, function, etc. This will
   * be logged as a console warning unless a different log level is given in the
   * `args` parameter.
   * @param name The name of the deprecated class, property, function, etc.
   * @param args Information about the deprecation and replacement recommendations.
   */
  public deprecated(name: string, args?: SkyLogDeprecatedArgs): void {
    const logLevel = args?.logLevel ?? SkyLogLevel.Warn;

    name = this.#convertStringToCode(name);

    if (this.#canLog(logLevel)) {
      const messageParts = [];

      if (args?.deprecationMajorVersion) {
        messageParts.push(
          this.#formatter.formatText(
            '{0} is deprecated starting in SKY UX {1}.',
            name,
            args.deprecationMajorVersion.toLocaleString(),
          ),
        );
      } else {
        messageParts.push(
          this.#formatter.formatText('{0} is deprecated.', name),
        );
      }

      if (args?.removalMajorVersion) {
        messageParts.push(
          this.#formatter.formatText(
            'We will remove it in version {0}.',
            args.removalMajorVersion.toLocaleString(),
          ),
        );
      } else {
        messageParts.push('We will remove it in a future major version.');
      }

      if (args?.replacementRecommendation) {
        messageParts.push(args.replacementRecommendation);
      }

      if (args?.moreInfoUrl) {
        messageParts.push(
          this.#formatter.formatText(
            'For more information, see {0}.',
            args.moreInfoUrl,
          ),
        );
      }

      this.#logBasedOnLevel(logLevel, messageParts.join(' '));
    }
  }

  /**
   * Logs a console error if the application's log level is `SkyLogLevel.Error`.
   * @param message The error message
   * @param params Optional parameters for the error message.
   */
  public error(message: string, params?: unknown[]): void {
    if (this.#canLog(SkyLogLevel.Error)) {
      this.#logWithParams('error', message, params);
    }
  }

  /**
   * Logs console information if the application's log level is `SkyLogLevel.Info` or above.
   * @param message The informational message
   * @param params Optional parameters for the informational message.
   */
  public info(message: string, params?: unknown[]): void {
    if (this.#canLog(SkyLogLevel.Info)) {
      this.#logWithParams('log', message, params);
    }
  }

  /**
   * Logs a console warning if the application's log level is `SkyLogLevel.Warn` or above.
   * @param message The warning message
   * @param params Optional parameters for the warning message.
   */
  public warn(message: string, params?: unknown[]): void {
    if (this.#canLog(SkyLogLevel.Warn)) {
      const messageKey = this.#buildMessageKey(message, params);

      // Only log each warning once per application instance to avoid drowning out other
      // important messages in the console.
      if (!previousWarnings.has(message)) {
        this.#logWithParams('warn', message, params);
        previousWarnings.add(messageKey);
      }
    }
  }

  #convertStringToCode(typeString: string): string {
    if (typeString.charAt(0) !== '`' && typeString.charAt(-1) !== '`') {
      typeString = '`' + typeString + '`';
    }
    return typeString;
  }

  #canLog(intendedLogLevel: SkyLogLevel): boolean {
    return intendedLogLevel >= this.#applicationLogLevel;
  }

  #logBasedOnLevel(
    logLevel: SkyLogLevel,
    message: string,
    params?: unknown[],
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

  #logWithParams(
    logMethod: 'log' | 'warn' | 'error',
    message: string,
    params: unknown[] | undefined,
  ): void {
    if (params) {
      console[logMethod](message, ...params);
    } else {
      console[logMethod](message);
    }
  }

  #buildMessageKey(message: string, params?: unknown[]): string {
    let key = message;

    if (params?.length) {
      key = `${key} ${params.join(' ')}`;
    }

    return key;
  }
}
