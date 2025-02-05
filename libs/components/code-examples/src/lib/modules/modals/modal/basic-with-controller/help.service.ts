import { Injectable } from '@angular/core';
import {
  SkyHelpOpenArgs,
  SkyHelpService,
  SkyHelpUpdateArgs,
} from '@skyux/core';

/**
 * This is a mock implementation of the help service. In a production scenario,
 * the `SkyHelpService` would be provided at the application root.
 * @see: https://developer.blackbaud.com/skyux/learn/develop/global-help
 */
@Injectable({ providedIn: 'root' })
export class MyHelpService extends SkyHelpService {
  public override openHelp(args?: SkyHelpOpenArgs): void {
    if (args) {
      console.error(`Open help panel to key: ${args.helpKey}`);
    }
  }

  public override updateHelp(args: SkyHelpUpdateArgs): void {
    if ('helpKey' in args) {
      console.error(`help key update: ${args.helpKey}`);
    }

    if ('pageDefaultHelpKey' in args) {
      console.error(`page default help key update: ${args.pageDefaultHelpKey}`);
    }
  }
}
