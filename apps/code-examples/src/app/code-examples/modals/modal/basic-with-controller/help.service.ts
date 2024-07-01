import { Injectable } from '@angular/core';
import { SkyHelpOpenArgs, SkyHelpService } from '@skyux/core';

/**
 * This is a mock implementation of the help service. In a production scenario,
 * the `SkyHelpService` would be provided at the application root.
 * @see: https://developer.blackbaud.com/skyux/learn/develop/global-help
 */
@Injectable({ providedIn: 'root' })
export class MyHelpService extends SkyHelpService {
  public override openHelp(args: SkyHelpOpenArgs): void {
    console.error(`Open help panel to key: ${args.helpKey}`);
  }
}
