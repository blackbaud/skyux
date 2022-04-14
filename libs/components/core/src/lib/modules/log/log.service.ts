import { Inject, Injectable, Optional } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { forkJoin, of } from 'rxjs';

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
    private resourceService: SkyLibResourcesService,
    @Optional()
    @Inject(SKY_LOG_LEVEL)
    private applicationLogLevel: SkyLogLevel = SkyLogLevel.Error
  ) {}

  public async deprecated(
    type: string,
    args?: SkyLogDepcrecationArgs
  ): Promise<void> {
    const logLevel = args?.logLevel ?? SkyLogLevel.Warn;
    type = this.convertStringToCode(type);

    if (args?.replacementTypes) {
      if (args.replacementTypes instanceof Array) {
        for (let i = 0; i < args.replacementTypes.length; i++) {
          args.replacementTypes[i] = this.convertStringToCode(
            args.replacementTypes[i]
          );
        }
      } else {
        args.replacementTypes = [
          this.convertStringToCode(args.replacementTypes),
        ];
      }
    }

    if (this.canLog(logLevel)) {
      forkJoin([
        this.resourceService.getString('skyux_deprecation_warning', type),
        this.resourceService.getString(
          'skyux_deprecation_replacement',
          args?.replacementTypes
        ),
      ]).subscribe((localizedStrings) => {
        let message = localizedStrings[0];
        if (args?.replacementTypes) {
          message = localizedStrings.join(' ');
        }
        this.logBasedOnLevel(logLevel, message);
        return of();
      });
    }
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
    switch (this.applicationLogLevel) {
      case SkyLogLevel.Info:
        return (
          intendedLogLevel === SkyLogLevel.Info ||
          intendedLogLevel === SkyLogLevel.Warn ||
          intendedLogLevel === SkyLogLevel.Error
        );
      case SkyLogLevel.Warn:
        return (
          intendedLogLevel === SkyLogLevel.Warn ||
          intendedLogLevel === SkyLogLevel.Error
        );
      case SkyLogLevel.Error:
        return intendedLogLevel === SkyLogLevel.Error;
    }
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
